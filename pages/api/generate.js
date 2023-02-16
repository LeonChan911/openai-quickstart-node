import { Configuration, OpenAIApi } from "openai";
import { UserList } from "./login";
import { scheduleJob } from "node-schedule";
import { MongoClient } from "mongodb";
const url = process.env.MONGODB;

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
let UserListInfo = {};
const setUserListInfo = () => {
  MongoClient.connect(url)
    .then((conn) => {
      const user = conn.db("yin").collection("user");
      // 查询
      user
        .find()
        .toArray()
        .then((arr) => {
          if (arr && arr.length > 0) {
            let UserLists = arr[0];
            delete UserLists._id;
            UserListInfo = { ...UserLists };
          }
          conn.close();
        })
        .catch(() => {
          conn.close();
        });
    })
    .catch((err) => {});
};
setUserListInfo();
// 每天凌晨初始化
scheduleJob("0 0 0 * * *", () => {
  setUserListInfo();
});
export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured",
      },
    });
    return;
  }
  if (
    !req.cookies ||
    !req.cookies["x-username"] ||
    !UserListInfo[req.cookies["x-username"]]
  ) {
    res.status(500).json({
      error: {
        message: "cookie错误,非法请求",
      },
    });
    return;
  }
  if (UserListInfo[req.cookies["x-username"]].times <= 0) {
    res.status(501).json({
      error: {
        message: "用户超过当天使用次数，请明天再试",
      },
    });
    return;
  }
  UserListInfo[req.cookies["x-username"]].times--;

  const prompt = req.body.prompt || "";
  const type = req.body.type;

  if (prompt.trim().length === 0 && image.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid text",
      },
    });
    return;
  }
  try {
    if (type === "image") {
      const response = await openai.createImage({
        prompt,
        n: 1,
        size: "256x256",
      });
      res.status(200).json({ result: response.data.data[0].url });
    } else {
      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt,
        temperature: 0.6,
        max_tokens: 2000,
      });
      res.status(200).json({ result: response.data.choices[0].text });
    }
  } catch (error) {
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: "An error occurred during your request.",
        },
      });
    }
  }
}

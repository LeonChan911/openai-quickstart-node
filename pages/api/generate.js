import { Configuration, OpenAIApi } from "openai";
import fs from "fs";
import path from "path";
const configFile = path.resolve(__dirname, "./user.json");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const UserList = {
  root: {
    username: "root",
    password: "chenyin1991911",
    times: 1000000000,
  },
  user1: {
    username: "user1",
    password: "5tfded",
    times: 30,
  },
  user2: {
    username: "user2",
    password: "3dfef4",
    times: 30,
  },
  user3: {
    username: "user3",
    password: "134ed4",
    times: 30,
  },
  user4: {
    username: "user4",
    password: "dfe3we",
    times: 30,
  },
  user5: {
    username: "user5",
    password: "90jjj",
    times: 30,
  },
  user6: {
    username: "user6",
    password: "23d00f",
    times: 30,
  },
};

export default async function (req, res) {

    if (!configuration.apiKey) {
      res.status(500).json({
        error: {
          message:
            "OpenAI API key not configured, please follow instructions in README.md",
        },
      });
      return;
    }

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

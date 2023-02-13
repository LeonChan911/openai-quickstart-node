import { MongoClient } from "mongodb";
const url = process.env.MONGODB;

;export default async function (req, res) {
  const username = req.body.username.trim();
  const password = req.body.password.trim();
  console.log('url',url);
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
            if (
              UserLists[username] &&
              UserLists[username].password === password
            ) {
              res.status(200).json({ result: true, user: UserLists[username] });
            } else {
              res.status(400).json({ result: false });
            }
          }
          conn.close();
        });
    })
    .catch((err) => {
      res.status(400).json({ result: false });
    });
}

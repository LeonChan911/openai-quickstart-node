
export const UserList = {
  root: {
    username: "root",
    password: "chenyin1991911",
    times: 1000000000,
  },
  user1: {
    username: "user1",
    password: "5tfded",
    times: 100,
  },
  user2: {
    username: "user2",
    password: "3dfef4",
    times: 20,
  },
  user3: {
    username: "user3",
    password: "134ed4",
    times: 20,
  },
  user4: {
    username: "user4",
    password: "dfe3we",
    times: 20,
  },
  user5: {
    username: "user5",
    password: "90jjj",
    times: 20,
  },
  user6: {
    username: "user6",
    password: "23d00f",
    times: 20,
  },
  test: {
    username: "test",
    password: "test123",
    times: 3,
  },
};

export default async function (req, res) {
  const username = req.body.username.trim();
  const password = req.body.password.trim();

  if (UserList[username] && UserList[username].password === password) {
    res.status(200).json({ result: true, user: UserList[username] });
  } else {
    res.status(400).json({ result: false });
  }
}

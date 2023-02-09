import Head from "next/head";
import { useState, useEffect } from "react";
import Toast from "light-toast";
import Cookies from "js-cookie";
import styles from "./index.module.css";

export default function Home() {
  const [textInput, setTextInput] = useState("");
  const [result, setResult] = useState();
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const logout = () => {
    Cookies.set("x-username", "");
    Cookies.set("x-password", "");
    setUserInfo(null);
  };
  const login = async () => {
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (response.status !== 200) {
        Toast.info("用户密码错误");
      } else {
        Cookies.set("x-username", username);
        Cookies.set("x-password", password);
        setUserInfo(data.user);
      }
    } catch (error) {
      Toast.info("系统错误");
    }
  };
  const onSubmit = async (type) => {
    setLoading(true);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: textInput, type }),
      });

      const data = await response.json();

      if (response.status !== 200) {
        if (response.status === 501) {
          Toast.info("用户超过当天使用次数，请明天再试");
        } else {
          Toast.info("AI出错啦~ 请重新再试");
        }
        return;
      }

      setResult(data.result);
      console.log("输入:", textInput);
      console.log("ai算法:", data.result);
    } catch (error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      Toast.info("AI出错啦~ 请重新再试");
    }
    setLoading(false);
  };
  useEffect(() => {
    const xusername = Cookies.get("x-username");
    const xpassword = Cookies.get("x-password");
    if (xusername && xpassword) {
      setUserInfo({
        username: xusername,
        password: xpassword,
      });
    }
  }, []);
  return (
    <div>
      <Head>
        <title>Yin的ai许愿瓶</title>
      </Head>

      <main className={styles.main}>
        {/* <img src="/dog.png" className={styles.icon} /> */}
        {userInfo && (
          <button className={styles.loginout} onClick={() => logout()}>
            退出登录
          </button>
        )}
        <h3>Yin的ai许愿瓶</h3>
        <h4>基于chatGPT引擎</h4>
        {loading && <p>AI正在计算中...</p>}
        {userInfo ? (
          <div className={styles.form}>
            <textarea
              type="text"
              placeholder="描述"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
            />
            <button
              className={styles.sub}
              disabled={loading}
              onClick={() => onSubmit("image")}
            >
              生成图片
            </button>
            <button
              className={styles.sub}
              disabled={loading}
              onClick={() => onSubmit("text")}
            >
              文本回答
            </button>
          </div>
        ) : (
          <div className={styles.form}>
            <input
              type="text"
              placeholder="用户名"
              value={username}
              onChange={(e) => setUsername(e.target.value.trim())}
            />
            <input
              placeholder="密码"
              value={password}
              onChange={(e) => setPassword(e.target.value.trim())}
              type="password"
            />
            <button className={styles.sub} onClick={() => login()}>
              登录
            </button>
          </div>
        )}

        {/* <div className={styles.result}>{result}</div> */}
        {result && result.startsWith("http") ? (
          <img src={result} alt="" className={styles.image} />
        ) : (
          <div className={styles.result}>{result}</div>
        )}
        {!userInfo && <p>申请账号请添加微信号：godlovecy</p>}
        <div className={styles.pay}>
          <p>打赏他!!!</p>
          <img
            src="https://imagev2.xmcdn.com/storages/d832-audiofreehighqps/F6/AE/GMCoOR4HuSh0AAHhugH1c2O2.jpeg"
            alt=""
          />
        </div>
      </main>
    </div>
  );
}

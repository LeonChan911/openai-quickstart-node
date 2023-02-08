import Head from "next/head";
import { useState } from "react";
import Toast from "light-toast";
import styles from "./index.module.css";

export default function Home() {
  const [textInput, setTextInput] = useState("");
  const [result, setResult] = useState();
  const [ loading, setLoading] = useState(false);

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
        Toast.info("AI出错啦~ 请重新再试");
        throw (
          data.error ||
          new Error(`Request failed with status ${response.status}`)
        );
      }

      setResult(data.result);
      setLoading(false);
      console.log("输入:", textInput);
      console.log("ai算法:", data.result);
    } catch (error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      // alert(error.message);
    }
  };

  return (
    <div>
      <Head>
        <title>Yin的ai许愿瓶</title>
      </Head>

      <main className={styles.main}>
        {/* <img src="/dog.png" className={styles.icon} /> */}
        <h3>Yin的ai许愿瓶</h3>
        {loading && <p>AI正在计算中...</p>}
        <div className={styles.form}>
          <textarea
            type="text"
            placeholder="描述"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
          />
          <button disabled={loading} onClick={() => onSubmit("image")}>生成图片</button>
          <button disabled={loading}  onClick={() => onSubmit("text")}>文本回答</button>
        </div>
        {/* <div className={styles.result}>{result}</div> */}
        {result && result.startsWith("http") ? (
          <img src={result} alt="" className={styles.image} />
        ) : (
          <div className={styles.result}>{result}</div>
        )}
      </main>
    </div>
  );
}

const express = require("express");
const axios = require("axios");
const path = require("path"); // 경로를 다루기 위한 모듈
const app = express();

// 정적 파일을 제공할 디렉토리 설정
app.use(express.static(path.join(__dirname, "public")));

// 자연어 입력 처리 및 응답 페이지로 이동
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html")); // index.html 반환
});

// Directions API 호출
app.get("/get-directions", async (req, res) => {
  const { start, goal, option } = req.query;

  console.log("Query parameters:", { start, goal, option });

  const url = "https://naveropenapi.apigw.ntruss.com/map-direction/v1/driving";
  const headers = {
    "X-NCP-APIGW-API-KEY-ID": process.env.NAVER_CLIENT_ID,
    "X-NCP-APIGW-API-KEY": process.env.NAVER_CLIENT_SECRET,
  };

  try {
    const response = await axios.get(url, {
      params: { start, goal, option },
      headers: headers,
    });

    res.status(200).json(response.data);
  } catch (error) {
    res.status(error.response ? error.response.status : 500).json({
      error: error.message,
      details: error.response ? error.response.data : null,
    });
  }
});

// Vercel에서 실행될 때는 환경변수 `PORT`를 사용
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3000;
  const server = app.listen(PORT, () =>
    console.log(`Server running on port ${PORT}`)
  );
}

module.exports = app;

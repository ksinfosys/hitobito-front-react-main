const path = require('path');
const express = require('express');
const app = express();
const publicPath = path.join(__dirname, '..', 'dist');
const port = process.env.PORT || 3000;
const {createProxyMiddleware} = require('http-proxy-middleware')

const https = require("https");
const fs = require("fs");

const options = {
  key: fs.readFileSync('./localhost+2-key.pem'),
  cert: fs.readFileSync('./localhost+2.pem')
};

app.use(express.static(publicPath));
app.use(
  "/api",
  createProxyMiddleware({
    target: "https://hitobito-net.com/",
  //  target: "https://localhost:8081/api",
    changeOrigin: true,
  })
);

app.get('*', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});
app.listen(port, () => {
  console.log('Server is up!');
});

// https 의존성으로 certificate와 private key로 새로운 서버를 시작
https.createServer(options, app).listen(8000, () => {
  console.log(`HTTPS server started on port 8000`);

  app.use(
    "/api",
    createProxyMiddleware({
      target: "https://hitobito-net.com/",
      //target: "https://localhost:8081/api",
      changeOrigin: true,
    })
  );
});
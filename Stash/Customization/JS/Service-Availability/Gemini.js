const name = "Gemini";
const url = "https://gemini.google.com";
const start = Date.now();

$httpClient.get({ url, timeout: 15 }, (error, response) => {
  const elapsed = ((Date.now() - start) / 1000).toFixed(2);
  if (error || !response) {
    console.log(`[${name}] 请求失败: ${JSON.stringify(error || "无响应对象")}`);
    return $done({ title: name, content: "连接失败" });
  }
  const code = response.status;
  const content = code >= 200 && code <= 399 ? `可访问·响应 ${elapsed} s`
    : code === 403 || code === 404 ? `响应·HTTP ${code}·${elapsed} s`
    : code >= 400 && code <= 499 ? `异常·HTTP ${code}·${elapsed} s`
    : code >= 500 && code <= 599 ? `错误·HTTP ${code}·${elapsed} s`
    : `异常·HTTP ${code}·${elapsed} s`;
  console.log(`[${name}] HTTP ${code}, ${elapsed}s`);
  $done({ title: name, content });
});
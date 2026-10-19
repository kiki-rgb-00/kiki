const name = "Claude"; // Claude.js 改成 Claude
const url = "https://claude.ai"; // Claude.js 改成 https://claude.ai
const start = Date.now();

$httpClient.head({
  url: url,
  timeout: 15,
}, (error, response) => {
  const elapsed = ((Date.now() - start) / 1000).toFixed(2);

  if (error || !response) {
    console.log(`[${name}] 请求失败: ${String(error || "无响应对象")}`);
    return $done({ title: name, content: "连接失败" });
  }

  const code = response.status;
  let content;

  if (code >= 200 && code <= 399) {
    content = `可访问·响应 ${elapsed} s`;
  } else if (code === 403 || code === 404) {
    content = `响应·HTTP ${code}·${elapsed} s`;
  } else if (code >= 400 && code <= 499) {
    content = `异常·HTTP ${code}·${elapsed} s`;
  } else if (code >= 500 && code <= 599) {
    content = `错误·HTTP ${code}·${elapsed} s`;
  } else {
    content = `异常·HTTP ${code}·${elapsed} s`;
  }

  console.log(`[${name}] HTTP ${code}, ${elapsed}s`);
  $done({ title: name, content });
});
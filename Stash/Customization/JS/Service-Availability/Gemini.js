const name = "Gemini";
const url = "https://gemini.google.com/";
const start = Date.now();

$httpClient.get(
  {
    url: url,
    timeout: 15,
    "auto-redirect": true
  },
  function (error, response) {
    const elapsed = ((Date.now() - start) / 1000).toFixed(2);

    if (error || !response) {
      console.log("[Gemini] Request Error: " + String(error || "No response"));
      console.log("[Gemini] Elapsed: " + elapsed + "s");

      $done({
        title: name,
        content: "连接失败·" + elapsed + " s",
        icon: "https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/google-gemini.png"
      });
      return;
    }

    const code = response.status;
    console.log("[Gemini] HTTP " + code + ", " + elapsed + "s");

    let content;

    if (code >= 200 && code <= 399) {
      content = "可访问·响应 " + elapsed + " s";
    } else if (code === 403 || code === 404) {
      content = "响应·HTTP " + code + "·" + elapsed + " s";
    } else if (code >= 400 && code <= 499) {
      content = "异常·HTTP " + code + "·" + elapsed + " s";
    } else if (code >= 500 && code <= 599) {
      content = "错误·HTTP " + code + "·" + elapsed + " s";
    } else {
      content = "异常·HTTP " + code + "·" + elapsed + " s";
    }

    $done({
      title: name,
      content: content,
      icon: "https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/google-gemini.png"
    });
  }
);
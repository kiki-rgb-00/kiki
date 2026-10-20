async function request(method, params) {
  return new Promise((resolve, reject) => {
    const httpMethod = $httpClient[method.toLowerCase()];
    httpMethod(params, (error, response, data) => {
      resolve({ error, response, data });
    });
  });
}

async function main() {
  const { error, response, data } = await request("GET", "https://claude.ai");

  if (error) {
    $done({
      content: "Network Error",
      backgroundColor: "",
    });
    return;
  }

  const body = (data || "").toLowerCase();
  if (
    body.includes("not available in your country") ||
    body.includes("unsupported country") ||
    body.includes("unavailable in your region")
  ) {
    $done({
      content: "Not Available",
      backgroundColor: "",
    });
    return;
  }

  if (body.includes("claude")) {
    $done({
      content: "Available",
      backgroundColor: "#D4A373",
    });
    return;
  }

  $done({
    content: "Unknown",
    backgroundColor: "",
  });
}

(async () => {
  main()
    .then((_) => {})
    .catch((error) => {
      $done({});
    });
})();
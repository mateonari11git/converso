export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return new Response("No code provided", { status: 400 });
  }

  const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id: env.GITHUB_CLIENT_ID,
      client_secret: env.GITHUB_CLIENT_SECRET,
      code,
    }),
  });

  const data = await tokenResponse.json();

  if (!data.access_token) {
    return new Response(`OAuth Error: ${JSON.stringify(data)}`, {
      status: 500,
    });
  }

  const payload = JSON.stringify({
    token: data.access_token,
    provider: "github",
  });

  return new Response(`
<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>Autorizando...</title>
</head>
<body>
  <p>Autorizando...</p>

  <script>
    const message = 'authorization:github:success:${payload}';

    function sendMessage() {
      if (window.opener) {
        window.opener.postMessage(message, "*");
      }
    }

    sendMessage();

    window.addEventListener("message", function () {
      sendMessage();
    });

    setTimeout(sendMessage, 300);
    setTimeout(sendMessage, 700);
    setTimeout(function () {
      sendMessage();
      window.close();
    }, 1200);
  </script>
</body>
</html>
`, {
    headers: {
      "Content-Type": "text/html",
    },
  });
}
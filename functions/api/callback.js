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
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      client_id: env.GITHUB_CLIENT_ID,
      client_secret: env.GITHUB_CLIENT_SECRET,
      code
    })
  });

  const data = await tokenResponse.json();

  if (!data.access_token) {
    return new Response(`OAuth Error: ${JSON.stringify(data)}`, {
      status: 500
    });
  }

  const payload = JSON.stringify({
    token: data.access_token,
    provider: "github"
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

    if (window.opener) {
      window.opener.postMessage(message, "*");

      setTimeout(() => {
        window.opener.postMessage(message, "*");
      }, 500);

      setTimeout(() => {
        window.opener.postMessage(message, "*");
        window.close();
      }, 1200);
    } else {
      document.body.innerHTML = "<p>No se encontró la ventana de administración. Cierra esta pestaña e intenta de nuevo desde /admin.</p>";
    }
  </script>
</body>
</html>
`, {
    headers: {
      "Content-Type": "text/html"
    }
  });
}
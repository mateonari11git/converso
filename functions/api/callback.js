function renderBody(status, content) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Autorizando...</title>
</head>
<body>
  <script>
    const receiveMessage = (message) => {
      window.opener.postMessage(
        'authorization:github:${status}:${JSON.stringify(content)}',
        message.origin
      );

      window.removeEventListener("message", receiveMessage, false);
      window.close();
    };

    window.addEventListener("message", receiveMessage, false);
    window.opener.postMessage("authorizing:github", "*");
  </script>
</body>
</html>
`;
}

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return new Response(
      renderBody("error", { message: "No se recibió código de GitHub." }),
      { headers: { "Content-Type": "text/html" } }
    );
  }

  const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      client_id: env.GITHUB_CLIENT_ID,
      client_secret: env.GITHUB_CLIENT_SECRET,
      code
    })
  });

  const tokenData = await tokenResponse.json();

  if (tokenData.error) {
    return new Response(
      renderBody("error", tokenData),
      { headers: { "Content-Type": "text/html" } }
    );
  }

  return new Response(
    renderBody("success", { token: tokenData.access_token }),
    { headers: { "Content-Type": "text/html" } }
  );
}
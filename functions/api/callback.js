export async function onRequest(context) {
  const { request, env } = context;

  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return new Response("No code provided", { status: 400 });
  }

  const tokenResponse = await fetch(
    "https://github.com/login/oauth/access_token",
    {
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
    }
  );

  const data = await tokenResponse.json();

  if (!data.access_token) {
    return new Response(
      `OAuth Error: ${JSON.stringify(data)}`,
      { status: 500 }
    );
  }

  return new Response(
    `
<!doctype html>
<html>
  <body>
    <script>
      (function() {
        function receiveMessage(e) {
          window.opener.postMessage(
            'authorization:github:success:${JSON.stringify({
              token: data.access_token,
            })}',
            '*'
          );

          window.close();
        }

        window.addEventListener("message", receiveMessage, false);

        window.opener.postMessage("authorizing:github", "*");
      })();
    </script>
  </body>
</html>
`,
    {
      headers: {
        "Content-Type": "text/html",
      },
    }
  );
}
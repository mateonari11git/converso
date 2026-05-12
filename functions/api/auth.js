export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  const clientId = env.GITHUB_CLIENT_ID;

  if (!clientId) {
    return new Response("Falta GITHUB_CLIENT_ID en Cloudflare.", {
      status: 500,
    });
  }

  const scope = url.searchParams.get("scope") || "repo,user";
  const redirectUri = `${url.origin}/api/callback`;

  const githubUrl = new URL("https://github.com/login/oauth/authorize");
  githubUrl.searchParams.set("client_id", clientId);
  githubUrl.searchParams.set("redirect_uri", redirectUri);
  githubUrl.searchParams.set("scope", scope.replace(",", " "));

  return Response.redirect(githubUrl.toString(), 302);
}
export async function POST() {
  return new Response(
    JSON.stringify({ message: "Logged out successfully" }),
    {
      headers: {
        // clear the cookie
        "Set-Cookie": "token=; HttpOnly; Path=/; Max-Age=0",
      },
    }
  );
}

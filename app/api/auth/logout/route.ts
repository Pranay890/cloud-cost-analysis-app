export async function POST(request: Request) {
  const response = Response.json({ message: 'Logout successful' }, { status: 200 });
  response.headers.set(
    'Set-Cookie',
    'user=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0'
  );
  return response;
}

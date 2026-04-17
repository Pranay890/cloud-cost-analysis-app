import { authenticateUser } from '@/lib/auth-service';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    console.log('🔐 [LOGIN API] Attempting login:', { email });

    if (!email || !password) {
      console.error('❌ [LOGIN API] Missing email or password');
      return Response.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const user = await authenticateUser(email, password);
    console.log('✅ [LOGIN API] Authentication successful:', { userEmail: user.email });

    // Set cookie for session
    const response = Response.json({ user, message: 'Login successful' }, { status: 200 });
    response.headers.set(
      'Set-Cookie',
      `user=${JSON.stringify(user)}; Path=/; HttpOnly; SameSite=Strict`
    );

    return response;
  } catch (error: any) {
    console.error('❌ [LOGIN API] Error:', error.message);
    return Response.json(
      { error: error.message || 'Login failed' },
      { status: 401 }
    );
  }
}

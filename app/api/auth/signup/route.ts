import { createUser } from '@/lib/auth-service';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name, password, confirmPassword } = body;

    console.log('📝 [SIGNUP API] Received:', { email, name });

    if (!email || !name || !password) {
      console.error('❌ [SIGNUP API] Missing fields');
      return Response.json(
        { error: 'Email, name, and password are required' },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      console.error('❌ [SIGNUP API] Passwords do not match');
      return Response.json(
        { error: 'Passwords do not match' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      console.error('❌ [SIGNUP API] Password too short');
      return Response.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    const user = await createUser(email, name, password);
    console.log('✅ [SIGNUP API] User created:', { userEmail: user.email });

    // Set cookie for session (in production, use secure tokens)
    const response = Response.json({ user, message: 'Signup successful' }, { status: 201 });
    response.headers.set(
      'Set-Cookie',
      `user=${JSON.stringify(user)}; Path=/; HttpOnly; SameSite=Strict`
    );

    return response;
  } catch (error: any) {
    console.error('❌ [SIGNUP API] Error:', error.message);
    return Response.json(
      { error: error.message || 'Signup failed' },
      { status: 400 }
    );
  }
}

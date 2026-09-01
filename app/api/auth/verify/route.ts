import { getUserByEmail, getAllUsers } from '@/lib/auth-service';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const email = url.searchParams.get('email');
    const action = url.searchParams.get('action');

    // Debug endpoint to see all users
    if (action === 'list-all') {
      const allUsers = await getAllUsers();
      console.log('🔍 [VERIFY] All users:', allUsers);
      return Response.json({ 
        count: allUsers.length,
        users: allUsers,
        timestamp: new Date().toISOString()
      });
    }

    if (email) {
      console.log('🔍 [VERIFY] Looking up email:', email);
      const user = await getUserByEmail(email);
      
      if (user) {
        console.log('✅ [VERIFY] User found:', user);
        return Response.json({ user, found: true });
      } else {
        console.log('❌ [VERIFY] User not found:', email);
        return Response.json({ 
          user: null, 
          found: false,
          searchedEmail: email,
          normalizedEmail: email.toLowerCase().trim()
        });
      }
    }

    const allUsers = await getAllUsers();
    return Response.json({ 
      message: 'Verify endpoint - provide email parameter or ?action=list-all',
      totalUsers: allUsers.length,
      users: allUsers
    });
  } catch (error: any) {
    console.error('❌ [VERIFY] Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

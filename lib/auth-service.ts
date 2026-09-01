import { getUser, addUser, getAllUsers as getAllStoredUsers } from './auth-storage';

// MongoDB-backed persistent storage for users
export async function createUser(email: string, name: string, password: string) {
  const normalizedEmail = email.toLowerCase().trim();
  
  console.log('📝 [AUTH-SERVICE] createUser called with:', {
    originalEmail: email,
    normalizedEmail,
    name,
  });

  try {
    const newUser = await addUser(normalizedEmail, name, password);
    console.log('✅ [AUTH-SERVICE] User created and stored:', normalizedEmail);
    const allUsers = await getAllStoredUsers();
    console.log('📋 [AUTH-SERVICE] All stored users:', allUsers.map(u => u.email));
    return { id: newUser.id, email: newUser.email, name: newUser.name };
  } catch (error: any) {
    console.error('❌ [AUTH-SERVICE] createUser error:', error.message);
    throw error;
  }
}

export async function authenticateUser(email: string, password: string) {
  const normalizedEmail = email.toLowerCase().trim();

  console.log('🔐 [AUTH-SERVICE] authenticateUser called with:', {
    originalEmail: email,
    normalizedEmail,
  });

  const allUsers = await getAllStoredUsers();
  console.log('📋 [AUTH-SERVICE] Available users in storage:', allUsers.map(u => u.email));

  const user = await getUser(normalizedEmail);

  if (!user) {
    console.error('❌ [AUTH-SERVICE] User not found:', normalizedEmail);
    throw new Error('User not found');
  }

  if (password !== user.password) {
    console.error('❌ [AUTH-SERVICE] Invalid password for user:', normalizedEmail);
    throw new Error('Invalid password');
  }

  console.log('✅ [AUTH-SERVICE] Authentication successful:', normalizedEmail);
  return { id: user.id, email: user.email, name: user.name };
}

export async function getUserByEmail(email: string) {
  const normalizedEmail = email.toLowerCase().trim();
  const user = await getUser(normalizedEmail);
  if (!user) return null;
  return { id: user.id, email: user.email, name: user.name };
}

export async function getAllUsers() {
  const allUsers = await getAllStoredUsers();
  return allUsers.map(u => ({
    email: u.email,
    name: u.name,
    id: u.id,
    createdAt: u.createdAt
  }));
}

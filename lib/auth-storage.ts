import { connectToDatabase } from './db';
import { UserModel } from '@/models/User';

interface StoredUser {
  id: string;
  email: string;
  name: string;
  password: string;
  createdAt: string;
}

export async function getUser(email: string): Promise<StoredUser | null> {
  const normalizedEmail = email.toLowerCase().trim();
  await connectToDatabase();
  
  const user = await UserModel.findOne({ email: normalizedEmail }).lean();
  if (!user) return null;
  
  return {
    id: (user as any)._id.toString(),
    email: (user as any).email,
    name: (user as any).name,
    password: (user as any).password,
    createdAt: (user as any).createdAt?.toISOString?.() || new Date().toISOString(),
  };
}

export async function addUser(email: string, name: string, password: string): Promise<StoredUser> {
  const normalizedEmail = email.toLowerCase().trim();
  await connectToDatabase();

  // Check if user already exists
  const existing = await UserModel.findOne({ email: normalizedEmail });
  if (existing) {
    throw new Error('User already exists');
  }

  const newUser = await UserModel.create({
    email: normalizedEmail,
    name,
    password,
  });

  return {
    id: newUser._id.toString(),
    email: newUser.email,
    name: newUser.name,
    password: newUser.password,
    createdAt: newUser.createdAt?.toISOString?.() || new Date().toISOString(),
  };
}

export async function getAllUsers(): Promise<StoredUser[]> {
  await connectToDatabase();
  
  const users = await UserModel.find({}).lean();
  return (users as any[]).map((u: any) => ({
    id: u._id.toString(),
    email: u.email,
    name: u.name,
    password: u.password,
    createdAt: u.createdAt?.toISOString?.() || new Date().toISOString(),
  }));
}

export async function clearAllUsers() {
  await connectToDatabase();
  
  // Delete all users except the test user
  await UserModel.deleteMany({});
  
  // Re-create the default test user
  await UserModel.create({
    email: 'test@example.com',
    name: 'Test User',
    password: 'password123',
  });
}

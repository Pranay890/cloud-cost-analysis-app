import * as fs from 'fs';
import * as path from 'path';

interface StoredUser {
  id: string;
  email: string;
  name: string;
  password: string;
  createdAt: string;
}

interface UserStorage {
  users: StoredUser[];
}

const STORAGE_FILE = path.join(process.cwd(), '.auth-storage.json');

// Ensure directory exists
function ensureStorageFile() {
  try {
    if (!fs.existsSync(STORAGE_FILE)) {
      const initialData: UserStorage = {
        users: [
          {
            id: 'test-user-123',
            email: 'test@example.com',
            name: 'Test User',
            password: 'password123',
            createdAt: new Date().toISOString(),
          },
        ],
      };
      fs.writeFileSync(STORAGE_FILE, JSON.stringify(initialData, null, 2));
    }
  } catch (error) {
    console.error('Error ensuring storage file:', error);
  }
}

function readStorage(): UserStorage {
  try {
    ensureStorageFile();
    const data = fs.readFileSync(STORAGE_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading storage:', error);
    return { users: [] };
  }
}

function writeStorage(data: UserStorage) {
  try {
    fs.writeFileSync(STORAGE_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing storage:', error);
  }
}

export function getUser(email: string): StoredUser | null {
  const normalizedEmail = email.toLowerCase().trim();
  const storage = readStorage();
  const user = storage.users.find(u => u.email === normalizedEmail);
  return user || null;
}

export function addUser(email: string, name: string, password: string): StoredUser {
  const normalizedEmail = email.toLowerCase().trim();
  const storage = readStorage();

  // Check if user already exists
  if (storage.users.find(u => u.email === normalizedEmail)) {
    throw new Error('User already exists');
  }

  const newUser: StoredUser = {
    id: Math.random().toString(36).substring(7),
    email: normalizedEmail,
    name,
    password,
    createdAt: new Date().toISOString(),
  };

  storage.users.push(newUser);
  writeStorage(storage);

  return newUser;
}

export function getAllUsers(): StoredUser[] {
  const storage = readStorage();
  return storage.users.map(u => ({
    id: u.id,
    email: u.email,
    name: u.name,
    password: u.password,
    createdAt: u.createdAt,
  }));
}

export function clearAllUsers() {
  const storage: UserStorage = {
    users: [
      {
        id: 'test-user-123',
        email: 'test@example.com',
        name: 'Test User',
        password: 'password123',
        createdAt: new Date().toISOString(),
      },
    ],
  };
  writeStorage(storage);
}

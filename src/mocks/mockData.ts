import { User, UserRole } from '../types/auth.types';

// Mock users data
export const users: User[] = [
  {
    id: '1',
    username: 'admin',
    role: UserRole.ADMIN,
  },
  {
    id: '2',
    username: 'manager',
    role: UserRole.MANAGER,
  },
  {
    id: '3',
    username: 'staff',
    role: UserRole.STAFF,
  },
];

// Mock credentials for testing
export const mockCredentials = {
  admin: { username: 'admin', password: 'admin123' },
  manager: { username: 'manager', password: 'manager123' },
  staff: { username: 'staff', password: 'staff123' },
};
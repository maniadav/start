import { IUser } from '../User';

export const dummyUsers: Partial<IUser>[] = [
  {
    role: "admin",
    email: "admin@bhishmalab.com",
    password: "admin123", // Will be hashed before saving
  },
  {
    role: "organisation",
    email: "ashoka@university.edu",
    password: "org123",
  },
  {
    role: "organisation", 
    email: "iitb@iitbombay.ac.in",
    password: "org123",
  },
  {
    role: "observer",
    email: "observer1@ashoka.edu",
    password: "obs123",
  },
  {
    role: "observer",
    email: "observer2@iitbombay.ac.in", 
    password: "obs123",
  },
  {
    role: "observer",
    email: "researcher@bhishmalab.com",
    password: "obs123",
  }
];

// Helper function to hash passwords (requires bcryptjs to be installed)
export async function hashUserPasswords(): Promise<Partial<IUser>[]> {
  const bcrypt = require('bcryptjs');
  const hashedUsers = await Promise.all(
    dummyUsers.map(async (user) => ({
      ...user,
      password: await bcrypt.hash(user.password!, 12)
    }))
  );
  return hashedUsers;
}

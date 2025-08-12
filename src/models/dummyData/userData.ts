import { IUser } from "../user.model";

export const dummyUsers: Partial<IUser>[] = [
  // 1 Admin User
  {
    role: "admin",
    email: "admin@example.com",
    password: "password",
  },
  // 2 Organisation Users
  {
    role: "organisation",
    email: "organisation@example.com",
    password: "password",
  },
  {
    role: "organisation",
    email: "ashoka@university.edu",
    password: "password",
  },
  {
    role: "organisation",
    email: "iitb@iitbombay.ac.in",
    password: "password",
  },

  // 3 Observer Users
  {
    role: "observer",
    email: "observer@example.com",
    password: "password",
  },
  {
    role: "observer",
    email: "observer2@iitbombay.ac.in",
    password: "password",
  },
  {
    role: "observer",
    email: "researcher@bhishmalab.com",
    password: "password",
  },
];

// Total: 6 users (1 admin + 2 organisations + 3 observers)

// Helper function to hash passwords (requires bcryptjs to be installed)
export async function hashUserPasswords(): Promise<Partial<IUser>[]> {
  const bcrypt = require("bcryptjs");
  const hashedUsers = await Promise.all(
    dummyUsers.map(async (user) => ({
      ...user,
      password: await bcrypt.hash(user.password!, 12),
    }))
  );
  return hashedUsers;
}

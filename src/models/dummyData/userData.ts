import { IUser } from "../user.model";

export const dummyUsers: Partial<IUser>[] = [
  {
    role: "admin",
    email: "startweb@bhismalab.org",
    password: "password",
  },
];

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

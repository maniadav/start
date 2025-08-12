"use client";
import { createContext } from "react";

interface AuthContextProps {
  user: any;
  member: any;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export default AuthContext;

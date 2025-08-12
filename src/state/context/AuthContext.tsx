"use client";
import { createContext } from "react";

interface AuthContextProps {
  user: any;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export default AuthContext;

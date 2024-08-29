"use client";
import React, { useContext, ReactNode } from "react";
import { LOCALSTORAGE } from "@constants/storage.constant";
import { getLocalStorageValue } from "@utils/localStorage";
import AuthContext from "state/context/AuthContext";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const user = getLocalStorageValue(LOCALSTORAGE.LOGGED_IN_USER, true);

  // useEffect(() => {
  //   if (!user) {
  //     router.push("/login");
  //   }
  // }, [user, router]);

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

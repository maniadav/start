"use client";
import { useAuth } from "../context/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { API_ENDPOINT } from "@constants/api.constant"; // Adjust the import path as necessary

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const router = useRouter();
  const path = usePathname();

  // Define routes that do not require authentication
  // const publicRoutes = ["/", API_ENDPOINT.auth.login, API_ENDPOINT.auth.register];
  // const publicRoutes = useMemo(
  //   () => ["/", API_ENDPOINT.auth.login, API_ENDPOINT.auth.register],
  //   []
  // );

  // useEffect(() => {
  //   if (!user?._id && !publicRoutes.includes(path)) {
  //     router.push(API_ENDPOINT.auth.login); // Redirect to login if not authenticated
  //   }
  // }, [user, router, path, publicRoutes]);

  // // If the user is not authenticated and the route is not public, return null
  // if (!user?._id && !publicRoutes.includes(path)) {
  //   return null; // or a loading spinner
  // }

  // Otherwise, render the children
  return <>{children}</>;
};

export default ProtectedRoute;

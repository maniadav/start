"use client";
import React, {
  useContext,
  ReactNode,
  useEffect,
  useMemo,
  useState,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { getLocalStorageValue } from "@utils/localStorage";
import { LOCALSTORAGE } from "@constants/storage.constant";
import { PAGE_ROUTES } from "@constants/route.constant";
import AuthContext from "state/context/AuthContext";
import Header from "components/Header";
import Footer from "components/Footer";
import LoadingSection from "components/section/loading-section";
import { initializeDummyData } from "@management/lib/dummy-data";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const user = getLocalStorageValue(LOCALSTORAGE.LOGGED_IN_USER, true);
  const router = useRouter();
  const path = usePathname();
  const currentPath = path.split("?")[0];

  const publicRoutes = useMemo(
    () => [
      PAGE_ROUTES.HOME.path,
      PAGE_ROUTES.LOGIN.path,
      PAGE_ROUTES.ABOUT.path,
      PAGE_ROUTES.CONTENT.path,
    ],
    []
  );

  const footerRoutes = useMemo(
    () => [
      PAGE_ROUTES.HOME.path,
      PAGE_ROUTES.CONTENT.path,
      PAGE_ROUTES.ABOUT.path,
      PAGE_ROUTES.CONTENT.path,
      ,
      PAGE_ROUTES.SURVEY.path,
    ],
    []
  );

  const showFooter = footerRoutes.includes(path);
  
  // creating dummy admin, organization, and observer in local storage for testing purposes
  useEffect(() => {
    initializeDummyData();
  }, []);

  // useEffect(() => {
  //   if (!user?.userId && !publicRoutes.includes(currentPath)) {
  //     router.push(PAGE_ROUTES.LOGIN.path); // Redirect to login if not authenticated
  //   }
  //   setLoading(false);
  // }, [user, router, path, publicRoutes, currentPath]);



  if (loading) {
    return <LoadingSection />;
  }

  return (
    <AuthContext.Provider value={{ user }}>
      <>
        {showFooter && <Header />}
        {children}
        {showFooter && <Footer />}
      </>
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

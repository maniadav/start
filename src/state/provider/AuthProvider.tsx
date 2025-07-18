"use client";
import React, {
  useContext,
  ReactNode,
  useEffect,
  useMemo,
  useState,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { PAGE_ROUTES } from "@constants/route.constant";
import AuthContext from "state/context/AuthContext";
import Header from "components/Header";
import Footer from "components/Footer";
import LoadingSection from "components/section/loading-section";
import { getCurrentMember, getCurrentUser } from "@utils/auth.utils";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const user = getCurrentUser();
  const member = getCurrentMember();
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

  useEffect(() => {
    if (!member?.user_id && !publicRoutes.includes(currentPath)) {
      router.push(PAGE_ROUTES.LOGIN.path);
    }
    setLoading(false);
  }, [member, router, path, publicRoutes, currentPath]);

  if (loading) {
    return <LoadingSection />;
  }

  return (
    <AuthContext.Provider value={{ user, member }}>
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

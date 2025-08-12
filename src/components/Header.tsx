"use client";
import { useEffect, useState } from "react";
import CommonIcon from "./common/CommonIcon";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "state/provider/AuthProvider";
import Link from "next/link";
import LanguageToggle from "./LanguageToggle";
import { BASE_URL } from "@constants/config.constant";
import LogOutPopupModal from "./popup/LogOutPopup";
import { NAV_ROUTES, PAGE_ROUTES } from "@constants/route.constant";
import {
  clearLocalStorageValue,
  removeLocalStorageValue,
} from "@utils/localStorage";

export const Header = () => {
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const router = useRouter();
  const { member } = useAuth();
  const handleLogout = () => {
    if (member?.userId) {
      if (member.role === "observer") {
        setShowPopup(!showPopup);
      } else {
        clearLocalStorageValue();
        router.push(`${PAGE_ROUTES.AUTH.LOGIN.path}`);
      }
    } else {
      router.push(`${PAGE_ROUTES.AUTH.LOGIN.path}`);
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="w-full fixed top-0 left-0 z-50 flex justify-center pointer-events-none">
      <nav
        className={`max-w-[900px] w-full mt-4 mx-2 flex items-center justify-between rounded-3xl px-4 py-2 transition-all duration-300 pointer-events-auto
        ${
          scrolled
            ? "backdrop-blur-lg bg-black/50 shadow-2xl"
            : "backdrop-blur-md bg-black/30 shadow-lg"
        }
        border-b border-white/10 glassmorphism`}
        style={{ border: "1.5px solid rgba(255,255,255,0.12)" }}
      >
        <Link href="/" className="flex items-center gap-2 pr-4">
          <Image
            src={`${BASE_URL}/icons/start-rounded-96.png`}
            alt="START Logo"
            width={36}
            height={36}
            className="rounded-full"
          />
          <span className="text-lg md:text-xl font-bold text-white tracking-wide drop-shadow">
            START
          </span>
        </Link>
        <ul className="hidden md:flex gap-6 items-center text-white/90 font-medium">
          {Object.values(NAV_ROUTES).map((route) => (
            <li key={route.path} className="relative group">
              <Link
                href={route.path}
                className={`flex items-center gap-1 transition rounded-lg px-2 py-1.5
                  ${pathname === route.path ? "text-primary font-bold" : ""}`}
              >
                {/* {route.icon && (
                  <CommonIcon
                    icon={route.icon}
                    height={18}
                    width={18}
                    className={pathname === route.path ? "text-primary" : ""}
                  />
                )} */}
                <span className="uppercase">{route.label}</span>
                <span
                  className={`absolute left-0 -bottom-0.5 h-[2px] w-full bg-primary origin-left transition-transform duration-300 scale-x-0 group-hover:scale-x-100
                    ${pathname === route.path ? "scale-x-100" : ""}`}
                  aria-hidden="true"
                />
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <LanguageToggle />
          <div className="flex gap-2 relative group">
            <button className="flex items-center px-2 py-1 rounded-full bg-white/10 hover:bg-white/20 transition border border-white/20">
              <Image
                src={member?.profile.image || `${BASE_URL}/svg/user.svg`}
                alt="User"
                className="rounded-full h-8 w-8 object-cover border border-gray-400"
                width={32}
                height={32}
              />
              <span className="ml-2 hidden md:block text-sm text-white/80">
                {mounted ? `Hi, ${member?.profile.name || "user"}` : ""}
              </span>
              {/* <CommonIcon
                icon="material-symbols:arrow-drop-up"
                height={25}
                width={25}
                rotate={90}
              /> */}
            </button>
            <button
              onClick={handleLogout}
              className="cursor-pointer gap-2 text-white/80 flex items-center px-2 py-1 rounded-full bg-primary hover:bg-black transition-color duration-300 ease-in-out border border-white/20"
            >
              <span className="ml-2 hidden md:block text-sm">
                {mounted ? `${member?.userId ? "Logout" : "Sign In"}` : ""}
              </span>
              <CommonIcon
                icon="ri:logout-circle-r-line"
                height={20}
                width={20}
                rotate={member?.userId ? 120 : 90}
              />
            </button>
          </div>
        </div>
      </nav>
      <LogOutPopupModal
        showFilter={showPopup}
        closeModal={() => setShowPopup(!showPopup)}
      />
    </header>
  );
};
export default Header;

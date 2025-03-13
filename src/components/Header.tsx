"use client";
import { useEffect, useState } from "react";
import CommonIcon from "./common/CommonIcon";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { API_ENDPOINT } from "@constants/api.constant";
import { useAuth } from "state/provider/AuthProvider";
import Link from "next/link";
import LanguageToggle from "./LanguageToggle";
import { getLocalStorageValue } from "@utils/localStorage";
import { LOCALSTORAGE } from "@constants/storage.constant";
import { BASE_URL } from "@constants/config.constant";

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const data = getLocalStorageValue(LOCALSTORAGE.LOGGED_IN_USER, true);
    setUser(data || null);
  }, []);

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="w-full h-auto px-2 flex justify-center">
      <div
        className={`max-w-[700px] absolute z-40 mt-5 bg-black/50 rounded-full w-full flex justify-between items-center py-1 px-8 transition-all`}
      >
        <Link href="/" className="flex items-center">
          <span className="self-center text-lg md:text-xl font-semibold whitespace-nowrap dark:text-white">
            START
          </span>
        </Link>

        <div className="flex items-center gap-2">
          {/* user profile */}
          <div className="relative group">
            <div className="flex items-center cursor-pointer px-3 py-2 text-sm font-normal text-center">
              <div className="h-auto mx-2">
                <Image
                  src={user?.profile || `${BASE_URL}/svg/user.svg`}
                  alt="logo"
                  className="rounded-full h-10 w-10 object-cover border-2 border-gray-400"
                  width={32}
                  height={32}
                ></Image>
              </div>

              <p className="hidden md:block capitalize text-gray-300 text-sm">
                {`Hi, ${user?.childName || "user"}`}
              </p>
              <span className="text-gray-500">
                <CommonIcon
                  icon="material-symbols:arrow-drop-up"
                  height={25}
                  width={25}
                  rotate={90}
                />
              </span>
            </div>
            <div className="group-hover:block hidden">
              <DropDown />
            </div>
          </div>
          <LanguageToggle />
          {/* <div
            className="cursor-pointer rounded p-1 md:p-2 flex flex-row bg-black text-gray-400 items-center hover:bg-gray-800 hover:text-white"
            onClick={toggle}
          >
            <div className="hidden md:block mr-1 rounded items-center">
              Menu
            </div>
            <CommonIcon icon="pepicons-pop:menu" />
          </div> */}
        </div>
      </div>
      {/* side navigation bar */}
      <div
        className={`${
          isOpen
            ? `fixed w-full md:w-72 h-full ease-linear transform transition duration-500 z-40 left-0 top-0 bg-white opacity-100`
            : `fixed w-full md:w-72 h-full ease-linear transform transition duration-500 z-40 left-0 top-0 -translate-x-full bg-transparent opacity-0 bg-[#0d0d0d]`
        }`}
      >
        {/* <div
          className="h-screen w-full text-white top-5 right-6 bg-transparent text-[2rem] cursor-pointer outline-none"
          onClick={toggle}
        >
          <span className="w-full  md:w-72 items-end" onClick={toggle}>
            <CommonIcon icon="mingcute:close-fill" height={20} width={20} />
          </span>
        </div> */}
        <div className="p-2 flex justify-start w-full text-black text-base cursor-pointer outline-none">
          <CommonIcon
            icon="mingcute:close-fill"
            height={20}
            width={20}
            click={toggle}
          />
        </div>


      </div>
    </div>
  );
};

export const menuLink = [
  {
    label: "Home",
    slug: "/",
  },
  {
    label: "Blog",
    slug: "/blog",
  },
  {
    label: "Alfaaz-e-Sukhan",
    slug: "/poem",
  },
  {
    label: "Photography",
    slug: "/photography",
  },
  {
    label: "About",
    slug: "/about",
  },
];

export const DropDown = () => {
  const router = useRouter();
  const { user } = useAuth();

  return (
    <div className="mr-20 absolute z-10 bg-white rounded-lg shadow w-44 dark:bg-gray-700">
      <div className="py-2 text-sm text-gray-700 dark:text-gray-200">
        <Link
          href="/"
          className="w-full hover:bg-gray-900 px-6 py-2 flex gap-2 items-center"
        >
          <span className="">
            <CommonIcon icon="ion:settings-outline" height={20} width={20} />
          </span>
          <span>Settings</span>
        </Link>
        <button
          className="w-full hover:bg-gray-900 px-6 py-2 flex gap-2 items-center"
          onClick={() => {
            localStorage.clear();
            router.push(`${API_ENDPOINT.auth.login}`);
          }}
        >
          <span className="">
            <CommonIcon icon="ri:logout-circle-r-line" height={20} width={20} />
          </span>

          <span> {user ? "Logout" : "Sign In"}</span>
        </button>
      </div>
    </div>
  );
};

export default Header;

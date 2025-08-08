"use client";
import { Toaster } from "react-hot-toast";
import UserProfileUpdate from "components/user/user-profile-update";
import UserPasswordUpdate from "components/user/user-password-update";
import UserProfileDelete from "components/user/user-profile-delete";
import UserSignOut from "components/user/user-sign-out";

const ProfileSetting = () => {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="bg-white pt-52 w-full flex flex-col gap-5 px-3 md:px-16 lg:px-28 md:flex-row text-[#161931]">
        <aside className="hidden py-4 md:w-1/3 lg:w-1/4 md:block">
          <div className="sticky flex flex-col gap-2 p-4 text-sm top-12">
            <h2 className="pl-3 mb-4 text-4xl font-semibold">Settings</h2>
            {navTitle?.map((item) => (
              <a
                key={item.slug}
                href={item.slug}
                className={`text-xl capitalize flex items-center px-3 py-2.5 font-bold bg-white ${
                  "false" === item.slug &&
                  "border border-white lg:border-gray-400 rounded-full text-indigo-900"
                }`}
              >
                {item.title}
              </a>
            ))}
          </div>
        </aside>
        <main className="w-full min-h-screen py-1 md:w-2/3 lg:w-3/4  lg:border-indigo-100 border-l border-white">
          <UserProfileUpdate />
          <UserProfileDelete />
          <UserPasswordUpdate />
          <UserSignOut />
        </main>
      </div>
    </>
  );
};

export default ProfileSetting;

const navTitle = [
  { title: "Update Image", slug: "#profile-update" },
  { title: " Delete Account", slug: "#delete-account" },
  { title: "Update Password", slug: "#password-update" },
  { title: "Sign Out", slug: "#sign-out" },
];

"use client";
import { useState } from "react";
import UserProfileUpdate from "components/user/user-profile-update";
import UserPasswordUpdate from "components/user/user-password-update";
import UserProfileDelete from "components/user/user-profile-delete";
import UserSignOut from "components/user/user-sign-out";

const ProfileSetting = () => {
  const [activeTab, setActiveTab] = useState("#profile-update");

  const renderActiveComponent = () => {
    switch (activeTab) {
      case "#profile-update":
        return <UserProfileUpdate />;
      case "#delete-account":
        return <UserProfileDelete />;
      case "#password-update":
        return <UserPasswordUpdate />;
      case "#sign-out":
        return <UserSignOut />;
      default:
        return <UserProfileUpdate />;
    }
  };

  return (
    <div className="bg-white pt-52 w-full flex flex-col gap-5 px-3 md:px-16 lg:px-28  text-[#161931]">
      <aside className="py-4 w-full">
        <div className="sticky p-4 text-sm top-12">
          <h2 className="pl-3 mb-4 text-4xl font-semibold">Settings</h2>
          <div className="flex overflow-x-auto pb-2 hide-scrollbar">
            {navTitle?.map((item) => (
              <a
                key={item.slug}
                href={item.slug}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab(item.slug);
                }}
                className={`text-base capitalize whitespace-nowrap flex items-center px-4 py-2.5 font-medium rounded-2xl mr-2 ${
                  activeTab === item.slug
                    ? "bg-primary text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {item.title}
              </a>
            ))}
          </div>
        </div>
      </aside>
      <main className="w-full min-h-screen py-1 lg:border-indigo-100 border-t border-white">
        {renderActiveComponent()}
      </main>
    </div>
  );
};

export default ProfileSetting;

const navTitle = [
  { title: "Update Image", slug: "#profile-update" },
  { title: "Delete Account", slug: "#delete-account" },
  { title: "Update Password", slug: "#password-update" },
  { title: "Sign Out", slug: "#sign-out" },
];

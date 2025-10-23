"use client";

import { Card, CardContent, CardHeader } from "components/ui/card";
import { SidebarTriggerComp } from "@components/ui/SidebarTrigger";
import { useState } from "react";
import UserProfileUpdate from "components/user/user-profile-update";
import UserPasswordUpdate from "components/user/user-password-update";
import UserProfileDelete from "components/user/user-profile-delete";
import UserSignOut from "components/user/user-sign-out";

export default function Settings() {
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
    <div className="p-4 md:p-8">
      <SidebarTriggerComp title="Admin Settings" />
      <Card>
        <CardHeader>
          <div className="flex overflow-x-auto pb-2 hide-scrollbar">
            {navTitle?.map((item) => (
              <a
                key={item.slug}
                href={item.slug}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab(item.slug);
                }}
                className={`text-xs capitalize whitespace-nowrap flex items-center px-4 py-2.5 font-medium rounded-full mr-2 ${
                  activeTab === item.slug
                    ? "bg-primary text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {item.title}
              </a>
            ))}
          </div>
        </CardHeader>
        <CardContent className="w-auto overflow-x-scroll">
          <main className="w-full min-h-screen py-1 lg:border-indigo-100 border-t border-white">
            {renderActiveComponent()}
          </main>
        </CardContent>
      </Card>
    </div>
  );
}

const navTitle = [
  { title: "Update Profile", slug: "#profile-update" },
  { title: "Delete Account", slug: "#delete-account" },
  { title: "Update Password", slug: "#password-update" },
  { title: "Sign Out", slug: "#sign-out" },
];

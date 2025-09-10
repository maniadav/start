import React from "react";
import { IconHome } from "./ui/Icons";
import Link from "next/link";

const TopNav = ({
  primaryText,
  secondaryText,
}: {
  primaryText: string;
  secondaryText: string;
}) => {
  return (
    <nav className="flex px-4 justify-between items-center">
      <div className="flex flex-row gap-4 items-center align-middle">
        <Link legacyBehavior href="/">
          <a className="font-bold text-xl md:text-4xl">
            <IconHome />
          </a>
        </Link>
        <p className="text-xl md:text-4xl font-bold ">
          {primaryText}
          <span className="ml-2 text-primary">{secondaryText}</span>
        </p>
      </div>
    </nav>
  );
};

export default TopNav;

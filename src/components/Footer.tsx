import React from "react";
import CommonIcon from "./common/CommonIcon";
import Image from "next/image";
import { PAGE_ROUTES } from "@constants/route.constant";
import { BASE_URL } from "@constants/config.constant";
import Link from "next/link";
import CacheResetButton from "./button/CacheResetButton";

const SOCIAL_LINKS = [
  {
    href: "https://github.com/maniadav/START",
    label: "Github",
    icon: "mdi:github",
  },
  {
    href: "https://linkedin.com",
    label: "Linkedin",
    icon: "mdi:linkedin",
  },
  {
    href: "https://facebook.com",
    label: "Facebook",
    icon: "mdi:facebook",
  },
];

const LOCATIONS = ["India", "United Kingdom", "London"];

// const COMPANY_LINKS = [
//   { href: PAGE_ROUTES.ABOUT.path, label: "The team" },
//   { href: PAGE_ROUTES.CONTENT.path, label: "Data Format" },
//   { href: PAGE_ROUTES.SURVEY.path, label: "Perform Survey" },
//   { href: PAGE_ROUTES.ABOUT.path, label: "Join us" },
// ];

const Footer = () => {
  return (
    <footer className="w-full bg-black pt-10 pb-4 mt-0">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 border-t border-gray-900 pt-16">
        {/* Branding */}
        <div className="flex flex-col items-center md:items-start gap-2 md:gap-4 mb-6 md:mb-0">
          <Image
            src={`${BASE_URL}/image/start-logo.png`}
            alt="START Logo"
            width={48}
            height={48}
            className="rounded-lg"
          />
          <span className="text-2xl font-bold text-white tracking-wide font-serif">
            START
          </span>

          <CacheResetButton />
          <span className="text-xs text-gray-500">
            Empowering Early Development
          </span>
        </div>
        {/* Social */}
        <ul className="space-y-2 text-gray-400">
          <li className="text-xl pb-2 font-serif text-gray-200 font-bold">
            Social
          </li>
          {SOCIAL_LINKS.map(({ href, label, icon }) => (
            <li key={label}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-white transition"
              >
                <CommonIcon icon={icon} width={20} height={20} /> {label}
              </a>
            </li>
          ))}
        </ul>
        {/* Locations */}
        <ul className="space-y-2 text-gray-400">
          <li className="text-xl pb-2 font-serif text-gray-200 font-bold">
            Locations
          </li>
          {LOCATIONS.map((loc) => (
            <li key={loc}>
              <span className="hover:text-white transition cursor-default">
                {loc}
              </span>
            </li>
          ))}
        </ul>
        {/* Company */}
        <ul className="space-y-2 text-gray-400">
          <li className="text-xl pb-2 font-serif text-gray-200 font-bold">
            Company
          </li>
          <li key={PAGE_ROUTES.ABOUT.path} className="capitalize">
            <Link href={PAGE_ROUTES.ABOUT.path}>Know about us</Link>
          </li>
          <li key={PAGE_ROUTES.CONTENT.path} className="capitalize">
            <Link href={PAGE_ROUTES.CONTENT.path}>check data format</Link>
          </li>
          <li key={PAGE_ROUTES.SURVEY.path} className="capitalize">
            <Link href={PAGE_ROUTES.SURVEY.path}>ready for the survey?</Link>
          </li>
        </ul>
      </div>
      <div className="mt-8 border-t border-gray-800 pt-4 text-center text-gray-500 text-xs">
        {`© 2025 START. All rights reserved.`}
      </div>
    </footer>
  );
};

export default Footer;

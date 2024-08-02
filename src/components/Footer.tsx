import React from "react";

const Footer = () => {
  return (
    <div className="w-full h-auto bg-black">
      <div className="container mx-auto overflow-hidden p-8 md:p-10 lg:p-12 border-t border-gray-900 rounded-lg">
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4 ">
          <ul className="space-y-1 text-gray-400">
            <li className="text-xl pb-4 font-serif text-gray-200 font-bold">
              Social
            </li>
            <li>
              <a
                href="https://twitter.com/victormustar"
                className="hover:underline"
              >
                Twitter
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Linkedin
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Facebook
              </a>
            </li>
          </ul>
          <ul className="space-y-1 text-gray-400">
            <li className="text-xl pb-4 font-serif text-gray-200 font-bold">
              Locations
            </li>
            <li>
              <a href="#" className="hover:underline">
                Paris
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                New York
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                London
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Singapour
              </a>
            </li>
          </ul>
          <ul className="space-y-1 text-gray-400">
            <li className="text-xl pb-4 font-serif text-gray-200 font-bold">Company</li>
            <li>
              <a href="#" className="hover:underline">
                The team
              </a>
            </li>
            <li>
              <a href="/about" className="hover:underline">
                About us
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Our vision
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Join us
              </a>
            </li>
          </ul>
          <ul className="space-y-1 text-gray-400">
            <li className="text-xl pb-4 font-serif text-gray-200 font-bold">More</li>
            <li>
              <a href="#" className="hover:underline">
                Github Repo
              </a>
            </li>
          </ul>
        </div>{" "}
      </div>{" "}
    </div>
  );
};

export default Footer;

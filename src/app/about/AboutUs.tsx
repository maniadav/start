// "use client";
import React from "react";
import Image from "next/image";
import { IconSurvey } from "components/common/Icons";
// import CommonIcon from "./common/CommonIcon";

const AboutUs = () => {
  return (
    <div className="w-full h-auto bg-gradient-to-b from-black to-black">
      <div className="container mx-auto overflow-hidden p-8 md:p-10 lg:p-12 ">
        <div className="grid grid-row gap-8 cols md:grid-cols-2">
          <div className="w-full flex align-middle items-center">
            <div className="block w-full">
              <Image
                src="/image/about_title.png"
                width={500}
                height={500}
                className="w-full max-w-lg m-auto"
                alt="brain image"
              />
            </div>
          </div>
          <div className="flex flex-col justify-center ">
            <span className="w-20 h-2 bg-gray-800 dark:bg-white mb-12"></span>{" "}
            <p className="self-start inline font-sans text-xl font-medium text-transparent bg-clip-text bg-gradient-to-br from-green-400 to-green-600">
              About Us
            </p>
            <h2 className="text-4xl font-bold text-gray-300">
              Know a bit more about our collaborators
            </h2>
            <div className="h-8"></div>
            <div className="grid grid-cols-2 gap-4 pt-8 border-t border-gray-800">
              <a
                href="/about"
                className="flex gap-2 flex-row w-full items-center justify-center px-5 py-3 text-sm font-medium text-center text-gray-200 border border-gray-200 rounded-lg sm:w-auto hover:bg-gray-700 focus:ring-4 focus:ring-gray-100 bg-primary"
              >
                <IconSurvey width="1.5" height="1.5" />
                <p> Read...</p>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;

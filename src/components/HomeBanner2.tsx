// "use client";
import React from "react";
import { IconSurvey } from "./common/Icons";
import Image from "next/image";
// import CommonIcon from "./common/CommonIcon";

const HomeBanner = () => {
  return (
    <div className="w-full h-auto bg-gradient-to-b from-gray-900 to-black">
      <div className="container mx-auto overflow-hidden p-8 md:p-10 lg:p-12 ">
        <div className="grid grid-row gap-8 cols-reverse md:grid-cols-2">
          <div className="flex flex-col justify-center order-2 md:order-1">
            <span className="w-20 h-2 bg-gray-800 dark:bg-white mb-12"></span>{" "}
            <p className="self-start inline font-sans text-xl font-medium text-transparent bg-clip-text bg-gradient-to-br from-green-400 to-green-600">
              Simple and easy
            </p>
            <h2 className="text-4xl font-bold text-gray-300">
              Made for childs brain testing!!
            </h2>
            {/* <h1 className="font-bebas-neue uppercase text-6xl sm:text-8xl font-black flex flex-col leading-none dark:text-white text-gray-800">
              Be the
              <span className="text-5xl sm:text-7xl">Change</span>
            </h1> */}
            <div className="h-6"></div>
            <p className="font-serif text-xl text-gray-400 md:pr-20">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Magnam
              autem, a recusandae vero praesentium qui impedit doloremque
              molestias necessitatibus.
            </p>
            <div className="h-8"></div>
            <div className="grid grid-cols-2 gap-4 pt-8 border-t border-gray-800">
              <div>
                <p className="font-semibold text-gray-400">Are You Ready?</p>
                <div className="h-4"></div>
                <a
                  href="/survey"
                  className="flex gap-2 flex-row w-full items-center justify-center px-5 py-3 text-sm font-medium text-center text-gray-200 border border-gray-200 rounded-lg sm:w-auto hover:bg-gray-700 focus:ring-4 focus:ring-gray-100 bg-primary"
                >
                  <IconSurvey width="1.5" height="1.5" />
                  <p> Start the Survey</p>
                </a>
              </div>
            </div>
          </div>
          <div className="order-1 md:order-2">
            {/* <div className="-mr-24 rounded-lg md:rounded-l-full bg-gradient-to-br from-gray-900 to-black h-96"></div> */}
            <div className="block w-full">
              {/* <img src="/brain.png" className="w-full max-w-lg m-auto" /> */}
              <Image
                src="/brain.png"
                width={500}
                height={500}
                className="w-full max-w-lg m-auto"
                alt="brain image"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeBanner;

"use client";
import { BASE_URL } from "@constants/config.constant";
import { LOCALSTORAGE } from "@constants/storage.constant";
import { getLocalStorageValue } from "@utils/localStorage";
import SurveyTable from "components/SurveyTable";
import UserComp from "components/UserComp";
import Image from "next/image";
import Link from "next/link";

const ContentPage = () => {
  const user = getLocalStorageValue(LOCALSTORAGE.LOGGED_IN_USER, true);

  return (
    <div className="">
      <div className="grid md:grid-cols-3 h-full md:h-screen text-black">
        <div className="w-full mb-10 col-span-3 md:col-span-2">
          <div className=" mx-auto h-full sm:p-10">
            <header className="container px-4 lg:flex mt-20 md:mt-10 items-center h-full lg:mt-0">
              <div className="w-full">
                <h1 className="text-4xl lg:text-6xl font-extrabold tracking-tight drop-shadow mb-4">
                  Complete all <span className="text-primary">survey</span> ...
                </h1>
                <div className="w-32 h-2 bg-gradient-to-r from-primary to-red-900 rounded my-4"></div>
                <p className="text-xl mb-10 text-slate-700 max-w-2xl">
                  Perform a series of structured tasks designed to identify
                  early signs of autism in children aged 2-5 years.
                </p>

                <Link href="/content" legacyBehavior>
                  <a className="bg-gradient-to-r from-red-900 to-primary text-white text-2xl font-semibold px-6 py-3 rounded-lg shadow-lg inline-flex items-center justify-center w-full text-center border border-gray-200 sm:w-auto hover:scale-105 hover:bg-blue-700 transition-all duration-200 focus:ring-4 focus:ring-blue-200">
                    <svg
                      className="w-5 h-5 mr-3 text-white"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 496 512"
                    >
                      <path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"></path>
                    </svg>
                    Check Out the Data Format
                  </a>
                </Link>
              </div>
            </header>
          </div>
        </div>
        <div className="flex justify-end col-span-3 md:col-span-1">
          <Image
            src={`${BASE_URL}/image/survey.jpg`}
            width={400}
            height={500}
            className="w-full h-full object-cover"
            alt="brain image"
            priority
          />
        </div>
      </div>
      <div className="w-full h-full border-t py-10 md:py-4">
        <div className="container grid lg:grid-cols-2 items-center mx-auto">
          <div className="flex flex-col p-2">
            <p className="max-w-2xl text-lg tracking-tight text-slate-700">
              Welcome to your
              <span className="mx-2 border-b border-dotted border-slate-300 text-primary">
                survey
              </span>
              &
            </p>
            <h1 className="flex gap-2 mx-auto max-w-4xl font-display text-5xl font-medium tracking-tight text-slate-900 sm:text-7xl">
              <span className="inline-block">Your</span>
              <span className="relative text-primary">User</span>
              <span className="inline-block">Details</span>
            </h1>
          </div>
          <UserComp />
        </div>

        <SurveyTable />
      </div>
    </div>
  );
};

export default ContentPage;

"use client"
import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const Custom404 = () => {
  const router = useRouter();
  return (
    <div className="w-screen h-screen  flex items-center justify-center align-middle">
      <div className="lg:px-24 lg:py-24 md:py-20 md:px-44 px-4 py-24 items-center flex justify-center flex-col-reverse lg:flex-row md:gap-28 gap-16">
        <div className="bg-gray-200">
          <Image alt="anything" src="/image/404.jpg" width={400} height={400} />
        </div>
        <div className="xl:pt-24 w-full flex flex-col items-center align-middle justify-center xl:w-1/2 pb-12 lg:pb-0">
          <div className="">
            <h1 className="my-2 text-gray-800 font-bold text-2xl">
              {`Oops! You've stumbled upon an empty page`}
            </h1>
            <p className="my-2 text-gray-800">
              {`We couldn't find what you were looking for. How about heading back to the homepage to explore more?`}
            </p>
            <button
              className="sm:w-full lg:w-auto my-2 border rounded md py-4 px-8 text-center bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-700 focus:ring-opacity-50"
              onClick={() => router.push('/')}
            >
              Go to Homepage
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Custom404;

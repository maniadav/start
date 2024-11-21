'use client';
import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface errorComInterface {
  imageUrl: string;
  title: string;
  subTitle: string;
}
const ErrorComponent = ({ imageUrl, title, subTitle }: errorComInterface) => {
  const router = useRouter();
  return (
    <div className="w-screen h-screen  flex items-center justify-center align-middle overflow-hidden p-4 md:p-20">
      <div className="flex items-center justify-center flex-col-reverse lg:flex-row">
        <div className="">
          <Image alt="anything" src={imageUrl} width={400} height={400} />
        </div>
        <div className="xl:pt-24 w-full flex flex-col items-center align-middle justify-center xl:w-1/2 pb-12 lg:pb-0">
          <div className="">
            <h1 className="text-center lg:text-start my-2 text-gray-800 font-bold text-2xl">
              {title}
            </h1>
            <p className="text-center lg:text-start my-2 text-gray-800">
              {subTitle}
            </p>
            {/* <button
              className="sm:w-full lg:w-auto my-2 border rounded md py-4 px-8 text-center bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-700 focus:ring-opacity-50"
              onClick={() => router.push('/')}
            >
              Go to Homepage
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorComponent;

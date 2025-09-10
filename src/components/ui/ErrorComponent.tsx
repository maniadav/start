"use client";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface errorComInterface {
  imageUrl: string;
  title: string;
  subTitle: string;
  showHomeButton?: boolean;
}
const ErrorComponent = ({
  imageUrl,
  title,
  subTitle,
  showHomeButton = false,
}: errorComInterface) => {
  const router = useRouter();

  const handleGoHome = () => {
    // Use window.location.href for full page reload to reset initial dimensions
    window.location.href = "/";
  };
  return (
    <div className="w-screen h-screen  flex items-center justify-center align-middle overflow-hidden p-4 md:p-20">
      <div className="flex items-center justify-center flex-col-reverse lg:flex-row">
        <div className="">
          <Image alt="anything" src={imageUrl} width={400} height={400} />
        </div>
        <div className="xl:pt-24 w-full flex flex-col items-center align-middle justify-center xl:w-1/2 pb-12 lg:pb-0">
          <div className="">
            <h1 className="capitalize text-center lg:text-start my-2 text-primary font-bold text-2xl">
              {title}
            </h1>
            <p className="text-center lg:text-start my-2 text-gray-800">
              {subTitle}
            </p>
            {showHomeButton && (
              <div className="flex justify-center lg:justify-start mt-6">
                <button
                  onClick={handleGoHome}
                  className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/80 transition-colors duration-200"
                >
                  Go to Homepage
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorComponent;

"use client";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

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
            <h1 className="capitalize text-center lg:text-start my-2 text-primary font-bold text-2xl">
              {title}
            </h1>
            <p className="text-center lg:text-start my-2 text-gray-800">
              {subTitle}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorComponent;

"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

const IndexPage: React.FC = () => {
  const [isOnline, setIsOnline] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Redirect to homepage if online
      router.push("/");
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [router]);

  const handleRefresh = () => {
    console.log(navigator?.onLine);
    if (navigator.onLine) {
      router.push("/");
    } else {
      setIsOnline(false);
    }
  };

  return (
    <div className="w-screen h-screen  flex items-center justify-center align-middle bg-white">
      <div className="lg:px-24 lg:py-24 md:py-20 md:px-44 px-4 py-24 items-center flex justify-center flex-col-reverse lg:flex-row md:gap-28 gap-16">
        <div className="xl:pt-24 w-full flex flex-col items-center align-middle justify-center xl:w-1/2 pb-12 lg:pb-0">
          <div className="">
            <h1 className="my-2 text-gray-800 font-bold text-2xl">
              {isOnline
                ? "You are back online."
                : "Please check your internet connection and try again."}
            </h1>

            {isOnline ? (
              <Link
                href={"/"}
                className="mt-6 px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600"
              >
                Return to Homepage
              </Link>
            ) : (
              <button
                onClick={handleRefresh}
                className="mt-6 px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600"
              >
                Refresh
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndexPage;

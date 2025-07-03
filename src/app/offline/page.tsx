"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

const IndexPage: React.FC = () => {
  const [isOnline, setIsOnline] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Set initial online status
    setIsOnline(navigator.onLine);

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
    <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-br from-red-100 via-white to-red-200">
      <div className="bg-white rounded-3xl shadow-2xl p-10 flex flex-col items-center max-w-md w-full">
        <Image
          src={isOnline ? "/icons/icon-192.png" : "/image/restrict.jpg"}
          alt={isOnline ? "Online" : "Offline"}
          width={120}
          height={120}
          className="mb-6 rounded-full border-4 border-primary shadow-lg"
        />
        <h1 className="text-3xl font-extrabold text-gray-800 mb-2 text-center">
          {isOnline ? "You are back online!" : "No Internet Connection"}
        </h1>
        <p className="text-gray-500 text-center mb-6">
          {isOnline
            ? "You are now connected to the internet."
            : "It looks like you are offline. Please check your internet connection and try again."}
        </p>
        <div className="flex flex-col gap-3 w-full">
          <button
            onClick={handleRefresh}
            className="w-full px-4 py-2 bg-primary text-white rounded-lg font-semibold shadow hover:bg-primary/90 transition-colors duration-200"
          >
            Try Again
          </button>
          <Link
            href={"/"}
            className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold shadow hover:bg-gray-300 text-center transition-colors duration-200"
          >
            Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
};

export default IndexPage;

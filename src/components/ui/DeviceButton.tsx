"use client";
import { useState, useEffect } from "react";

const OS_ICONS: Record<string, JSX.Element> = {
  Windows: (
    <svg viewBox="0 0 448 512" width="30" fill="currentColor">
      <path d="M0 93.7L183.6 64V240H0V93.7zM200 62.1L448 29.1V240H200V62.1zM0 272H183.6V448L0 418.3V272zM200 272H448V482.9L200 449.9V272z" />
    </svg>
  ),
  MacOS: (
    <svg viewBox="0 0 384 512" width="30" fill="currentColor">
      <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
    </svg>
  ),
  Linux: (
    <svg viewBox="0 0 640 512" width="30" fill="currentColor">
      <path d="M160 0h320v512H160V0zm32 96v320h256V96H192zm80 336v16h80v-16h-80z" />
    </svg>
  ),
  Android: (
    <svg viewBox="0 0 576 512" width="30" fill="currentColor">
      <path d="M420.4 100.7l42.2-73c3.2-5.5 1.3-12.6-4.2-15.8s-12.6-1.3-15.8 4.2l-42.2 73c-36.3-13.7-76.3-21.1-118.4-21.1s-82 7.4-118.4 21.1l-42.2-73c-3.2-5.5-10.3-7.4-15.8-4.2s-7.4 10.3-4.2 15.8l42.2 73C99.5 120.7 64 188.1 64 256v128H0v64c0 17.7 14.3 32 32 32h64v32c0 35.3 28.7 64 64 64s64-28.7 64-64v-32h128v32c0 35.3 28.7 64 64 64s64-28.7 64-64v-32h64c17.7 0 32-14.3 32-32v-64h-64V256c0-67.9-35.5-135.3-91.6-155.3zM160 384h-64V256c0-50.8 20.8-99.2 54.6-135.3l6.2-6.5H160v272zm320 0h-64V128h3.1l6.2 6.5c33.8 36.1 54.6 84.5 54.6 135.3v128z" />
    </svg>
  ),
  iOS: (
    <svg viewBox="0 0 384 512" width="30" fill="currentColor">
      <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
    </svg>
  ),
  Unknown: (
    <svg viewBox="0 0 512 512" width="30" fill="currentColor">
      <path d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm0 110c24.3 0 44 19.7 44 44 0 24.3-19.7 44-44 44-24.3 0-44-19.7-44-44 0-24.3 19.7-44 44-44zm44 272c0 13.3-10.7 24-24 24h-40c-13.3 0-24-10.7-24-24v-40c0-13.3 10.7-24 24-24h40c13.3 0 24 10.7 24 24v40z" />
    </svg>
  ),
};

export default function DeviceButton() {
  const [deviceType, setDeviceType] = useState("Unknown");

  useEffect(() => {
    const platform = navigator.platform.toLowerCase();
    if (platform.includes("win")) setDeviceType("Windows");
    else if (platform.includes("mac")) setDeviceType("MacOS");
    else if (platform.includes("linux")) setDeviceType("Linux");
    else if (/android/i.test(navigator.userAgent)) setDeviceType("Android");
    else if (/iphone|ipad|ipod/i.test(navigator.userAgent))
      setDeviceType("iOS");
  }, []);

  return (
    <div className="cursor-pointer flex mt-3 w-48 h-14 bg-black hover:bg-black/80 text-white rounded-xl items-center justify-center">
      <div className="mr-3"> {OS_ICONS[deviceType]}</div>
      <div>
        <div className="text-xs">Download on your</div>
        <div className="text-center text-2xl font-semibold font-sans -mt-1">
          {deviceType}
        </div>
      </div>
    </div>
  );
}

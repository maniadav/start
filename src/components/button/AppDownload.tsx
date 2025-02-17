"use client";
import { useState, useEffect } from "react";

export default function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [deviceType, setDeviceType] = useState("Device");

  useEffect(() => {
    const platform = navigator.platform.toLowerCase();
    if (platform.includes("win")) setDeviceType("Windows");
    else if (platform.includes("mac")) setDeviceType("MacOS");
    else if (platform.includes("linux")) setDeviceType("Linux");
    else if (/android/i.test(navigator.userAgent)) setDeviceType("Android");
    else if (/iphone|ipad|ipod/i.test(navigator.userAgent))
      setDeviceType("iOS");
    else {
      setDeviceType("Device");
    }
  }, []);

  useEffect(() => {
    // Check if app is already installed
    const checkInstalled = () => {
      const isStandalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        (navigator as any).standalone; // For iOS Safari

      setIsInstalled(isStandalone);
    };

    checkInstalled(); // Run on mount

    // Listen for installation event
    const handleAppInstalled = () => {
      setIsInstalled(true);
    };

    window.addEventListener("appinstalled", handleAppInstalled);

    // Handle PWA install prompt event
    const handleBeforeInstallPrompt = (event: any) => {
      event.preventDefault();
      setDeferredPrompt(event);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("appinstalled", handleAppInstalled);
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === "accepted") {
          console.log("User installed the app");
        }
        setDeferredPrompt(null);
      });
    }
  };

  if (isInstalled) return null;

  return (
    <button
      onClick={handleInstallClick}
      disabled={!deferredPrompt}
      className="cursor-pointer flex mt-3 w-48 h-14 bg-black hover:bg-black/80 text-white rounded-xl items-center justify-center"
    >
      <div className="mr-3"> {OS_ICONS[deviceType]}</div>
      <div>
        <div className="text-xs">Download on your</div>
        <div className="text-center text-2xl font-semibold font-sans -mt-1">
          {deviceType}
        </div>
      </div>
    </button>
  );
}

const OS_ICONS: Record<string, JSX.Element> = {
  Windows: (
    <svg
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width="30"
      height="30"
    >
      <path
        d="M14.814.111A.5.5 0 0115 .5V7H7V1.596L14.395.01a.5.5 0 01.42.1zM6 1.81L.395 3.011A.5.5 0 000 3.5V7h6V1.81zM0 8v4.5a.5.5 0 00.43.495l5.57.796V8H0zm7 5.934l7.43 1.061A.5.5 0 0015 14.5V8H7v5.934z"
        fill="currentColor"
      ></path>
    </svg>
  ),
  MacOS: (
    <svg
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width="30"
      height="30"
    >
      <path
        d="M13.5 0A1.5 1.5 0 0115 1.5V7H0V1.5A1.5 1.5 0 011.5 0h12zM0 8v1.5A1.5 1.5 0 001.5 11H7v3H2v1h11v-1H8v-3h5.5A1.5 1.5 0 0015 9.5V8H0z"
        fill="currentColor"
      ></path>
    </svg>
  ),
  Linux: (
    <svg
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width="30"
      height="30"
    >
      <path
        d="M2.5 9.662c0-.758.224-1.498.645-2.129l.565-.847a7.203 7.203 0 001.07-2.583l.328-1.642a2.44 2.44 0 014.784 0l.329 1.642a7.18 7.18 0 001.07 2.583l.564.847c.42.63.645 1.371.645 2.129m-7.392 3.637c.386.13.8.201 1.23.201h2.324c.43 0 .844-.07 1.23-.201M6.5 5.5L4.947 8.606a2 2 0 001.79 2.894h1.527a2 2 0 001.789-2.894L8.5 5.5M6.5 3v1.5m2-1.5v1.5m-1.894-.053L5.5 5l.586.586a2 2 0 002.828 0L9.5 5l-1.106-.553a2 2 0 00-1.788 0zM.77 11.325l.479-1.196a1 1 0 01.928-.629h1.164a1 1 0 01.919.606l.93 2.172a1 1 0 01-.319 1.194l-.738.553a1 1 0 01-1.24-.031l-1.835-1.529a1 1 0 01-.288-1.14zm13.46 0l-.479-1.196a1 1 0 00-.928-.629h-1.164a1 1 0 00-.919.606l-.93 2.172a1 1 0 00.319 1.194l.738.553a1 1 0 001.24-.031l1.835-1.529a1 1 0 00.288-1.14z"
        stroke="currentColor"
      ></path>
    </svg>
  ),
  Android: (
    <svg
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width="30"
      height="30"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M7.5 4a6.473 6.473 0 00-2.934.698l-1.65-2.475-.832.554 1.627 2.44A6.492 6.492 0 001 10.5V13h13v-2.5a6.492 6.492 0 00-2.711-5.282l1.627-2.44-.832-.555-1.65 2.475A6.473 6.473 0 007.5 4zM5 10H4V9h1v1zm5 0h1V9h-1v1z"
        fill="currentColor"
      ></path>
    </svg>
  ),
  iOS: (
    <svg viewBox="0 0 384 512" width="30" fill="currentColor">
      <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
    </svg>
  ),
  Device: (
    <svg
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width="30"
      height="30"
    >
      <path d="M10 12h3v-1h-3v1z" fill="currentColor"></path>
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M9.5 0A1.5 1.5 0 008 1.5V3H1.5A1.5 1.5 0 000 4.5v6A1.5 1.5 0 001.5 12H6v2H4v1h9.5a1.5 1.5 0 001.5-1.5v-12A1.5 1.5 0 0013.5 0h-4zM8.085 14H7v-2h1v1.5c0 .175.03.344.085.5zM9.5 14h4a.5.5 0 00.5-.5V6H9v7.5a.5.5 0 00.5.5zM9 5h5V1.5a.5.5 0 00-.5-.5h-4a.5.5 0 00-.5.5V5z"
        fill="currentColor"
      ></path>
    </svg>
  ),
};

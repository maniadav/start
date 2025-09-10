
import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "./button";

const CacheResetButton = () => {
  const router = useRouter();
  const pathname = usePathname();

  const handleCacheReset = async () => {
    try {
      // Clear all caches (Cache API, sessionStorage, service worker)
      if ("caches" in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map((name) => caches.delete(name)));
      }

      sessionStorage.clear();

      if ("serviceWorker" in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(registrations.map((r) => r.unregister()));
      }

      alert("Cache and storage cleared successfully!");

      // Redirect to home page or refresh the current page
      if (pathname === "/") {
        window.location.reload();
      } else {
        router.push("/");
      }
    } catch (error) {
      console.error("Failed to clear cache:", error);
      alert("Failed to clear cache. See console for details.");
    }
  };

  return (
    <Button
      className={`px-4 py-2 rounded font-semibold transition focus:outline-none text-primary border border-primary hover:bg-primary hover:text-white`}
      onClick={handleCacheReset}
      variant="outline"
      aria-label="Clear cache and storage"
    >
      <span className="capitalize">Clear Cache</span>
    </Button>
  );
};

export default CacheResetButton;

import Button from "components/common/Button";
import React from "react";

const CacheResetButton = () => {
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
    } catch (error) {
      console.error("Failed to clear cache:", error);
      alert("Failed to clear cache. See console for details.");
    }
  };

  return (
    <Button
      className={`px-4 py-2 rounded font-semibold transition focus:outline-none text-primary`}
      onClick={handleCacheReset}
      variant="outline"
      aria-label="Clear cache and storage"
    >
      <span className="capitalize">Clear cache</span>
    </Button>
  );
};

export default CacheResetButton;

"use client";

import { useEffect, useRef } from "react";

interface ServiceWorkerUpdateOptions {
  enableLogging?: boolean;
  skipWaiting?: boolean;
}

export default function ServiceWorkerUpdater({
  enableLogging = process.env.NODE_ENV === "development",
  skipWaiting = false,
}: ServiceWorkerUpdateOptions = {}) {
  const isMounted = useRef(true);
  const isUpdating = useRef(false);
  const activeTimers = useRef<Set<NodeJS.Timeout>>(new Set());

  const log = (message: string) => {
    if (enableLogging && isMounted.current) {
      console.log(`[SW] ${message}`);
    }
  };

  // Simple update function
  const updateServiceWorker = async () => {
    if (
      !isMounted.current ||
      isUpdating.current ||
      !("serviceWorker" in navigator)
    ) {
      return;
    }

    try {
      isUpdating.current = true;
      log("Checking for service worker updates...");

      const registration = await navigator.serviceWorker.ready;
      if (!registration || !isMounted.current) return;

      await registration.update();
      log("Service worker update check completed");

      // Handle skip waiting if enabled and there's a waiting SW
      if (skipWaiting && registration.waiting) {
        registration.waiting.postMessage({ type: "SKIP_WAITING" });
        log("Sent SKIP_WAITING message");
      }
    } catch (error) {
      if (enableLogging && isMounted.current) {
        console.error("[SW] Update failed:", error);
      }
    } finally {
      isUpdating.current = false;
    }
  };

  // Safe timer management
  const addTimer = (callback: () => void, delay: number) => {
    const timer = setTimeout(() => {
      activeTimers.current.delete(timer);
      if (isMounted.current) callback();
    }, delay);
    activeTimers.current.add(timer);
    return timer;
  };

  useEffect(() => {
    // Check if service workers are supported
    if (!("serviceWorker" in navigator)) {
      log("Service workers not supported");
      return;
    }

    log("Service worker updater initialized");

    // Initial update check
    updateServiceWorker();

    // Update on tab focus
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        addTimer(updateServiceWorker, 1000);
      }
    };

    // Update when coming online
    const handleOnline = () => {
      addTimer(updateServiceWorker, 2000);
    };

    // Listen for SW messages
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === "SW_UPDATE_AVAILABLE") {
        log("Update available message received");
        updateServiceWorker();
      }
    };

    // Add listeners
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("online", handleOnline);
    navigator.serviceWorker.addEventListener("message", handleMessage);

    // Cleanup - capture current refs
    const currentTimers = activeTimers.current;

    return () => {
      isMounted.current = false;

      // Clear all timers
      currentTimers.forEach(clearTimeout);
      currentTimers.clear();

      // Remove listeners
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("online", handleOnline);
      navigator.serviceWorker.removeEventListener("message", handleMessage);

      log("Service worker updater cleaned up");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}

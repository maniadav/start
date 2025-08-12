import { useState, useEffect, useCallback } from "react";

interface WindowState {
  isLandscape: boolean;
  isWindowResized: boolean;
  width: number;
  height: number;
}

export const useWindowResize = () => {
  const [windowState, setWindowState] = useState<WindowState>({
    isLandscape: true,
    isWindowResized: false,
    width: 0,
    height: 0,
  });
  const [initialDimensions, setInitialDimensions] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    // Set initial dimensions only once on mount
    if (initialDimensions.width === 0 && initialDimensions.height === 0) {
      const initWidth = window.innerWidth;
      const initHeight = window.innerHeight;

      setInitialDimensions({ width: initWidth, height: initHeight });
      setWindowState({
        isLandscape: initWidth > initHeight,
        isWindowResized: false,
        width: initWidth,
        height: initHeight,
      });
    }

    // Check if current state is full screen
    const isFullScreen = () => {
      return !!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement
      );
    };

    const handleResize = () => {
      const currentWidth = window.innerWidth;
      const currentHeight = window.innerHeight;

      // Check if window width has decreased
      // but exclude full screen scenarios
      const hasResized =
        !isFullScreen() &&
        currentWidth < initialDimensions.width;

      setWindowState({
        isLandscape: currentWidth > currentHeight,
        isWindowResized: hasResized,
        width: currentWidth,
        height: currentHeight,
      });
    };

    // Add resize event listener
    window.addEventListener("resize", handleResize);

    // Add fullscreen change listeners to handle full screen transitions
    document.addEventListener("fullscreenchange", handleResize);
    document.addEventListener("webkitfullscreenchange", handleResize);
    document.addEventListener("mozfullscreenchange", handleResize);
    document.addEventListener("MSFullscreenChange", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("fullscreenchange", handleResize);
      document.removeEventListener("webkitfullscreenchange", handleResize);
      document.removeEventListener("mozfullscreenchange", handleResize);
      document.removeEventListener("MSFullscreenChange", handleResize);
    };
  }, [initialDimensions]); // Include initialDimensions in dependency array

  return {
    ...windowState,
    initialDimensions,
  };
};

'use client';
import React, { useEffect, useState } from 'react';
//  make sure screen is in landscape mode

const GameWrapper = ({ children }: any) => {
  const [isLandscape, setIsLandscape] = useState(true);

  // check for portrait mode
  useEffect(() => {
    const handleOrientationChange = () => {
      if (window.innerWidth > window.innerHeight) {
        setIsLandscape(true);
      } else {
        setIsLandscape(false);
      }
    };

    window.addEventListener('resize', handleOrientationChange);
    handleOrientationChange(); // Initial check

    return () => {
      window.removeEventListener('resize', handleOrientationChange);
    };
  }, []);

  // check for screen resize
  const [initialWidth, setInitialWidth] = useState(0);
  const [isWindowWide, setIsWindowWide] = useState(true);

  useEffect(() => {
    // Set the initial width when the component mounts
    setInitialWidth(window.innerWidth);

    // Function to check window size and set the state
    const checkWindowSize = () => {
      const currentWidth = window.innerWidth;
      if (currentWidth < initialWidth) {
        setIsWindowWide(false);
      } else {
        setIsWindowWide(true);
      }
    };

    // Add event listener for window resize
    window.addEventListener('resize', checkWindowSize);

    // Initial check
    checkWindowSize();

    // Cleanup event listener on component unmount
    return () => window.removeEventListener('resize', checkWindowSize);
  }, [initialWidth]);

  return (
    <div className="">
      {isLandscape ? (
        <>
          {isWindowWide ? (
            <div className="landscape-content">{children}</div>
          ) : (
            <div className="h-screen w-screen flex items-center align-middle justify-center text-center text-base font-semibold text-red-500 p-4">
              You are not advised to resize your screen!
            </div>
          )}
        </>
      ) : (
        <div className="h-screen w-screen flex items-center align-middle justify-center text-center text-base font-semibold text-red-500 p-4">
          Please rotate your device to landscape mode to continue.
        </div>
      )}
    </div>
  );
};

export default GameWrapper;

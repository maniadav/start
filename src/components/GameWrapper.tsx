"use client";
import React, { useEffect, useState } from "react";
import ErrorComponent from "./common/ErrorComponent";
import { BASE_URL } from "@constants/config.constant";
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

    window.addEventListener("resize", handleOrientationChange);
    handleOrientationChange(); // Initial check

    return () => {
      window.removeEventListener("resize", handleOrientationChange);
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
    window.addEventListener("resize", checkWindowSize);

    // Initial check
    checkWindowSize();

    // Cleanup event listener on component unmount
    return () => window.removeEventListener("resize", checkWindowSize);
  }, [initialWidth]);

  return (
    <div className="">
      {isLandscape ? (
        <>
          {isWindowWide ? (
            <div className="w-full overflow-hidden m-0">{children}</div>
          ) : (
            <ErrorComponent
              imageUrl={`${BASE_URL}/image/restrict.jpg`}
              title={"Uh-oh! Something went off-screen..."}
              subTitle={
                "It looks like resizing the window caused this issue. Please restore the screen to its recommended size or visit the homepage to continue exploring."
              }
            />
          )}
        </>
      ) : (
        <ErrorComponent
          imageUrl={`${BASE_URL}/image/sadcat.png`}
          title={"Oops! Looks like your device dimensions aren't compatible"}
          subTitle={
            "Please rotate your device to portrait mode to continue using the application."
          }
        />
      )}
    </div>
  );
};

export default GameWrapper;

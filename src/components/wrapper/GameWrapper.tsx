"use client";
import React from "react";
import { BASE_URL } from "@constants/config.constant";
import { useWindowResize } from "@hooks/useWindowResize";
import ErrorComponent from "../ui/ErrorComponent";

const GameWrapper = ({ children }: any) => {
  const { isLandscape, isWindowResized } = useWindowResize();

  return (
    <div className="">
      {isLandscape ? (
        <>
          {!isWindowResized ? (
            <div className="w-full overflow-hidden m-0">{children}</div>
          ) : (
            <ErrorComponent
              imageUrl={`${BASE_URL}/image/restrict.jpg`}
              title={"Uh-oh! Something went off-screen..."}
              subTitle={
                "It looks like resizing the window caused this issue. Please restore the screen to its original size or visit the homepage to continue exploring."
              }
              showHomeButton={true}
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

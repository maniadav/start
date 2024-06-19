"use client"
import { useEffect, useState } from "react";
// import './styles.css';

const GameWrapper = ({ children }: any) => {
  const [isLandscape, setIsLandscape] = useState(true);

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

  return (
    <div className="">
      {isLandscape ? (
        <div className="landscape-content">{children}</div>
      ) : (
        <div className="portrait-message">
          Please rotate your device to landscape mode to continue.
        </div>
      )}
    </div>
  );
};

export default GameWrapper;

import React, { useEffect, useState } from "react";

declare global {
  interface Window {
    webgazer: any;
  }
}

const WebGazer: React.FC = () => {
  const [isCalibrating, setIsCalibrating] = useState(true);

  useEffect(() => {
    const loadWebGazerScript = (): Promise<void> => {
      return new Promise((resolve, reject) => {
        if (typeof window !== "undefined") {
          const script = document.createElement("script");
          script.src = "/gazer.js"; // Make sure this path is correct
          script.async = true;
          script.onload = () => {
            console.log("WebGazer script loaded");
            resolve();
          };
          script.onerror = () => {
            reject(new Error("Failed to load WebGazer script"));
          };
          document.head.appendChild(script);
        }
      });
    };

    const initWebGazer = async () => {
      try {
        await loadWebGazerScript();

        if (window.webgazer) {
          window.webgazer
            .setGazeListener((data: any, elapsedTime: number) => {
              if (data) {
                const xprediction = data.x; // X coordinate relative to the viewport
                const yprediction = data.y; // Y coordinate relative to the viewport
                console.log(
                  `Gaze Data: X=${xprediction}, Y=${yprediction}, Time=${elapsedTime}`
                );
              } else {
                console.log("No gaze data available");
              }
            })
            .begin();

          // Start calibration process
          // if (isCalibrating) {
          //   window.webgazer.showPredictionPoints(true); // Show prediction points for calibration
          // } else {
          //   window.webgazer.showPredictionPoints(false); // Hide prediction points after calibration
          // }

          // Hide video and overlays
          window.webgazer.showVideo(false); // Hide video feed
          window.webgazer.showFaceOverlay(false); // Hide face overlay
          window.webgazer.showFaceFeedbackBox(false); // Hide face feedback box
        }
      } catch (error) {
        console.error("Error initializing WebGazer:", error);
      }
    };

    initWebGazer();

    return () => {
      if (window.webgazer) {
        window.webgazer.end(); // Clean up on unmount
      }
    };
  }, [isCalibrating]);

  // const handleCalibrationComplete = () => {
  //   setIsCalibrating(false);
  // };

  return (
    <></>// <button onClick={handleCalibrationComplete}>Complete Calibration</button>
  );
};

export default WebGazer;

import React, { useEffect } from "react";

// Define the type for GazeData
interface GazeData {
  docX: number;
  docY: number;
  state: number;
  GazeX: number;
  GazeY: number;
  HeadX: number;
  HeadY: number;
  HeadZ: number;
  HeadYaw: number;
  HeadPitch: number;
  HeadRoll: number;
}

// Extend the window interface to include GazeCloudAPI
interface Window {
  GazeCloudAPI?: {
    StartEyeTracking: () => void;
    StopEyeTracking: () => void;
    OnCalibrationComplete?: () => void;
    OnCamDenied?: () => void;
    OnError?: (msg: string) => void;
    UseClickRecalibration?: boolean;
    OnResult?: (GazeData: GazeData) => void;
  };
}

const GazeCloud: React.FC = () => {
  useEffect(() => {
    // Function to plot gaze data on the screen
    const PlotGaze = (GazeData: GazeData) => {
      const gazeElement = document.getElementById("gaze");
      const x = GazeData.docX - (gazeElement?.clientWidth || 0) / 2;
      const y = GazeData.docY - (gazeElement?.clientHeight || 0) / 2;

      if (gazeElement) {
        gazeElement.style.left = `${x}px`;
        gazeElement.style.top = `${y}px`;

        if (GazeData.state !== 0) {
          gazeElement.style.display = "none";
        } else {
          gazeElement.style.display = "block";
        }
      }

      const gazeDataElement = document.getElementById("GazeData");
      const headPoseDataElement = document.getElementById("HeadPhoseData");
      const headRotDataElement = document.getElementById("HeadRotData");

      if (gazeDataElement) {
        gazeDataElement.innerHTML = `GazeX: ${GazeData.GazeX} GazeY: ${GazeData.GazeY}`;
      }
      if (headPoseDataElement) {
        headPoseDataElement.innerHTML = `HeadX: ${GazeData.HeadX} HeadY: ${GazeData.HeadY} HeadZ: ${GazeData.HeadZ}`;
      }
      if (headRotDataElement) {
        headRotDataElement.innerHTML = `Yaw: ${GazeData.HeadYaw} Pitch: ${GazeData.HeadPitch} Roll: ${GazeData.HeadRoll}`;
      }
    };

    // Request camera access
    const requestCameraAccess = async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ video: true });
        console.log("Camera access granted");

        // Load GazeCloudAPI script dynamically
        const loadScript = () => {
          const script = document.createElement("script");
          script.src = "/gazecloud.js";
          script.async = true;
          script.onload = () => {
            console.log("GazeCloudAPI script loaded");

            if (window.GazeCloudAPI) {
              window.GazeCloudAPI.OnCalibrationComplete = () => {
                console.log("Gaze Calibration Complete");
              };
              window.GazeCloudAPI.OnCamDenied = () => {
                console.log("Camera access denied");
              };
              window.GazeCloudAPI.OnError = (msg: string) => {
                console.error("Error: " + msg);
              };
              window.GazeCloudAPI.UseClickRecalibration = true;
              window.GazeCloudAPI.OnResult = PlotGaze;

              // Automatically start eye tracking
              window.GazeCloudAPI.StartEyeTracking();
            } else {
              console.error(
                "GazeCloudAPI is not available on the window object."
              );
            }
          };
          script.onerror = () => {
            console.error("Failed to load GazeCloudAPI script.");
          };
          document.head.appendChild(script);
        };

        loadScript();
      } catch (error) {
        console.error("Camera access denied or error occurred: ", error);
      }
    };

    requestCameraAccess();

    return () => {
      // Cleanup script and stop tracking
      const script = document.querySelector("script[src='/gazecloud.js']");
      if (script) {
        document.head.removeChild(script);
      }

      // Stop eye tracking if available
      if (window.GazeCloudAPI) {
        window.GazeCloudAPI.StopEyeTracking();
      }
    };
  }, []);

  return (
    <div>
      <p id="GazeData"></p>
      <p id="HeadPhoseData"></p>
      <p id="HeadRotData"></p>
    </div>
  );
};

export default GazeCloud;

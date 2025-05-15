import { IndexDB_Storage } from "@constants/storage.constant";
import { convertFileToBase64 } from "@helper/binaryConvertion";
import { setIndexedDBValue } from "@utils/indexDB";
import CameraPermissionPopup from "components/popup/CameraPermissionPopup";
import { useEffect, useRef, useState } from "react";

const useVideoRecorder = () => {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const videoChunksRef = useRef<Blob[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [showCameraPopup, setShowCameraPopup] = useState(false);

  // Check camera permission on mount
  useEffect(() => {
    (async () => {
      try {
        // Check for camera permission status
        if (navigator.permissions) {
          const status = await navigator.permissions.query({ name: "camera" as PermissionName });
          if (status.state === "denied") {
            setShowCameraPopup(true);
          }
          status.onchange = () => {
            if (status.state === "denied") setShowCameraPopup(true);
            else setShowCameraPopup(false);
          };
        } else {
          // Fallback: try to access camera to trigger browser prompt
          try {
            await navigator.mediaDevices.getUserMedia({ video: true });
          } catch {
            setShowCameraPopup(true);
          }
        }
      } catch {
        setShowCameraPopup(true);
      }
    })();
  }, []);

  const startVidRecording = async () => {
    // Only proceed if permission is not denied
    if (showCameraPopup) return;

    try {
      const userStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });
      setStream(userStream);

      mediaRecorderRef.current = new MediaRecorder(userStream, {
        mimeType: "video/webm",
      });

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          videoChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing media devices.", error);
      // Handle the case where camera access is denied
      setShowCameraPopup(true);
    }
  };

  const stopVidRecording = (): Promise<string | null> => {
    return new Promise((resolve) => {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();

        mediaRecorderRef.current.onstop = async () => {
          const blob = new Blob(videoChunksRef.current, { type: "video/webm" });

          try {
            // Convert video blob to Base64
            const file = new File([blob], "video.webm", { type: "video/webm" });
            const base64data = await convertFileToBase64(file);

            await setIndexedDBValue(
              IndexDB_Storage.temporaryDB,
              IndexDB_Storage.tempVideo,
              base64data
            );

            videoChunksRef.current = [];
            setIsRecording(false);

            // Revoke camera access
            if (stream) {
              stream.getTracks().forEach((track) => track.stop());
              setStream(null);
            }

            resolve(base64data);
          } catch (error) {
            console.error("Error converting video to base64:", error);
            resolve(null);
          }
        };
      } else {
        resolve(null);
      }
    });
  };

  const CameraPermissionPopupUI = (
    <CameraPermissionPopup
      show={showCameraPopup}
      onRequestClose={() => setShowCameraPopup(false)}
    />
  );

  return {
    isRecording,
    startVidRecording,
    stopVidRecording,
    CameraPermissionPopupUI,
  };
};

export default useVideoRecorder;

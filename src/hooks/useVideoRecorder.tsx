// import { useRef, useState } from "react";

// const useVideoRecorder = () => {
//   const mediaRecorderRef = useRef<MediaRecorder | null>(null);
//   const videoChunksRef = useRef<Blob[]>([]);
//   const [isRecording, setIsRecording] = useState(false);

//   const startVidRecording = async () => {
//     const stream = await navigator.mediaDevices.getUserMedia({
//       video: true,
//       audio: true,
//     });

//     mediaRecorderRef.current = new MediaRecorder(stream, {
//       mimeType: "video/webm",
//     });

//     mediaRecorderRef.current.ondataavailable = (event) => {
//       if (event.data.size > 0) {
//         videoChunksRef.current.push(event.data);
//       }
//     };

//     mediaRecorderRef.current.start();
//     setIsRecording(true);
//   };

//   const stopVidRecording = () => {
//     if (mediaRecorderRef.current) {
//       mediaRecorderRef.current.stop();

//       mediaRecorderRef.current.onstop = () => {
//         const blob = new Blob(videoChunksRef.current, { type: "video/webm" });

//         // Convert Blob to Base64
//         const reader = new FileReader();
//         reader.readAsDataURL(blob);
//         reader.onloadend = () => {
//           const base64data = reader.result as string;
//           localStorage.setItem("recordedVideo", base64data);
//         };

//         // Clear the video chunks
//         videoChunksRef.current = [];
//         setIsRecording(false);
//       };
//     }
//   };

//   return { isRecording, startVidRecording, stopVidRecording };
// };

// export default useVideoRecorder;

import { useRef, useState } from "react";

const useVideoRecorder = () => {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const videoChunksRef = useRef<Blob[]>([]);
  const [isRecording, setIsRecording] = useState(false);

  const startVidRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    mediaRecorderRef.current = new MediaRecorder(stream, {
      mimeType: "video/webm",
    });

    mediaRecorderRef.current.ondataavailable = (event) => {
      if (event.data.size > 0) {
        videoChunksRef.current.push(event.data);
      }
    };

    mediaRecorderRef.current.start();
    setIsRecording(true);
  };

  const stopVidRecording = (): Promise<string | null> => {
    return new Promise((resolve) => {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();

        mediaRecorderRef.current.onstop = () => {
          const blob = new Blob(videoChunksRef.current, { type: "video/webm" });

          // Convert Blob to Base64
          const reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = () => {
            const base64data = reader.result as string;
            localStorage.setItem("recordedVideo", base64data);

            // Clear the video chunks
            videoChunksRef.current = [];
            setIsRecording(false);

            // Resolve with the Base64 data
            resolve(base64data);
          };
        };
      } else {
        resolve(null);
      }
    });
  };

  return { isRecording, startVidRecording, stopVidRecording };
};

export default useVideoRecorder;

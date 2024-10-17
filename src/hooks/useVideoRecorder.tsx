import { convertFileToBase64 } from '@helper/binaryConvertion';
import { setIndexedDBValue } from '@utils/indexDB';
import { useRef, useState } from 'react';

const useVideoRecorder = () => {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const videoChunksRef = useRef<Blob[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const startVidRecording = async () => {
    try {
      const userStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });
      setStream(userStream);

      mediaRecorderRef.current = new MediaRecorder(userStream, {
        mimeType: 'video/webm',
      });

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          videoChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing media devices.', error);
    }
  };

  // const stopVidRecording = (): Promise<string | null> => {
  //   return new Promise((resolve) => {
  //     if (mediaRecorderRef.current) {
  //       mediaRecorderRef.current.stop();

  //       mediaRecorderRef.current.onstop = () => {
  //         const blob = new Blob(videoChunksRef.current, { type: 'video/webm' });
  //         const reader = new FileReader();

  //         reader.onloadend = () => {
  //           const base64data = reader.result as string;
  //           localStorage.setItem('videoBase64', base64data);
  //           setIndexedDBValue('testing', 'videoBase64', base64data);
  //           videoChunksRef.current = [];
  //           setIsRecording(false);

  //           // Revoke camera access
  //           if (stream) {
  //             stream.getTracks().forEach((track) => track.stop());
  //             setStream(null);
  //           }

  //           resolve(base64data);
  //         };

  //         reader.readAsDataURL(blob);
  //       };
  //     } else {
  //       resolve(null);
  //     }
  //   });
  // };
  const stopVidRecording = (): Promise<string | null> => {
    return new Promise((resolve) => {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();

        mediaRecorderRef.current.onstop = async () => {
          const blob = new Blob(videoChunksRef.current, { type: 'video/webm' });

          try {
            // Use the convertFileToBase64 helper to convert the blob to base64
            const file = new File([blob], 'video.webm', { type: 'video/webm' });
            const base64data = await convertFileToBase64(file);

            // Save the base64 string to local storage and IndexedDB
            localStorage.setItem('videoBase64', base64data);
            setIndexedDBValue('testing', 'videoBase64', base64data);
            videoChunksRef.current = [];
            setIsRecording(false);

            // Revoke camera access
            if (stream) {
              stream.getTracks().forEach((track) => track.stop());
              setStream(null);
            }

            resolve(base64data);
          } catch (error) {
            console.error('Error converting video to base64:', error);
            resolve(null);
          }
        };
      } else {
        resolve(null);
      }
    });
  };

  return { isRecording, startVidRecording, stopVidRecording };
};

export default useVideoRecorder;

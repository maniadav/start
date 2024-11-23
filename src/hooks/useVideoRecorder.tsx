import { IndexDB_Storage } from '@constants/storage.constant';
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
      alert('Camera access is required for this task');
      window.location.reload();
    }
  };

  const stopVidRecording = (): Promise<string | null> => {
    return new Promise((resolve) => {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();

        mediaRecorderRef.current.onstop = async () => {
          const blob = new Blob(videoChunksRef.current, { type: 'video/webm' });

          try {
            // Convert video blob to Base64
            const file = new File([blob], 'video.webm', { type: 'video/webm' });
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

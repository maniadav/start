import { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import JSZip from 'jszip';

interface UseVideoEyeDetectionResult {
  processVideo: (base64Video: string) => Promise<string>;
  progress: number;
  processing: boolean;
}

export default function useEyeFeatureExtractor(): UseVideoEyeDetectionResult {
  const videoRef = useRef<HTMLVideoElement>(document.createElement('video'));
  const [progress, setProgress] = useState<number>(0);
  const [processing, setProcessing] = useState<boolean>(false);
  const zip = useRef(new JSZip()).current;
  const leftEyeFolder = zip.folder('left-eye');
  const rightEyeFolder = zip.folder('right-eye');

  useEffect(() => {
    const loadModels = async () => {
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
        await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
      } catch (error) {
        console.error('Error loading face-api models:', error);
      }
    };
    loadModels();
  }, []);

  // const processVideo = (base64Video: string): Promise<string> => {
  //   return new Promise((resolve, reject) => {
  //     if (!videoRef.current) return reject('Video element not available');

  //     const video = videoRef.current;
  //     video.src = base64Video;
  //     setProcessing(true);

  //     const handleProcessing = () => {
  //       const videoDuration = video.duration;

  //       const processFrame = async () => {
  //         if (video.currentTime >= video.duration || !processing) {
  //           setProcessing(false);

  //           try {
  //             const zipBlob = await zip.generateAsync({ type: 'blob' });
  //             const reader = new FileReader();
  //             reader.onloadend = () => resolve(reader.result as string);
  //             reader.readAsDataURL(zipBlob);
  //           } catch (error) {
  //             reject(`Error generating zip: ${error}`);
  //           }
  //           return;
  //         }

  //         const detections = await faceapi
  //           .detectSingleFace(
  //             video,
  //             new faceapi.TinyFaceDetectorOptions({
  //               inputSize: 224,
  //               scoreThreshold: 0.5,
  //             })
  //           )
  //           .withFaceLandmarks();

  //         if (detections) {
  //           const leftEye = detections.landmarks.getLeftEye();
  //           const rightEye = detections.landmarks.getRightEye();
  //           await cropAndStoreEye(leftEye, 'left', video.currentTime);
  //           await cropAndStoreEye(rightEye, 'right', video.currentTime);
  //         }

  //         setProgress((video.currentTime / videoDuration) * 100);
  //         video.currentTime += 1 / 30; // Move to next frame
  //         requestAnimationFrame(processFrame); // Process next frame
  //       };

  //       requestAnimationFrame(processFrame);
  //     };

  //     video.onloadedmetadata = () => {
  //       video.play();
  //       handleProcessing();
  //     };

  //     video.onerror = (error) => {
  //       setProcessing(false);
  //       reject(`Error processing video: ${error}`);
  //     };
  //   });
  // };

  const processVideo = (base64Video: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!videoRef.current) return reject('Video element not available');

      const video = videoRef.current;
      video.src = base64Video;
      setProcessing(true);

      const handleProcessing = () => {
        const videoDuration = video.duration;

        const processFrame = async () => {
          if (video.currentTime >= video.duration || !processing) {
            setProcessing(false);

            try {
              const zipBlob = await zip.generateAsync({ type: 'blob' });
              const base64Zip = await blobToBase64(zipBlob); // Convert blob to base64
              resolve(base64Zip);
            } catch (error) {
              reject(`Error generating zip: ${error}`);
            }
            return;
          }

          const detections = await faceapi
            .detectSingleFace(
              video,
              new faceapi.TinyFaceDetectorOptions({
                inputSize: 224,
                scoreThreshold: 0.5,
              })
            )
            .withFaceLandmarks();

          if (detections) {
            const leftEye = detections.landmarks.getLeftEye();
            const rightEye = detections.landmarks.getRightEye();
            await cropAndStoreEye(leftEye, 'left', video.currentTime);
            await cropAndStoreEye(rightEye, 'right', video.currentTime);
          }

          setProgress((video.currentTime / videoDuration) * 100);
          video.currentTime += 1 / 30; // Move to next frame
          requestAnimationFrame(processFrame); // Process next frame
        };

        requestAnimationFrame(processFrame);
      };

      video.onloadedmetadata = () => {
        video.play();
        handleProcessing();
      };

      video.onerror = (error) => {
        setProcessing(false);
        reject(`Error processing video: ${error}`);
      };
    });
  };

  const cropAndStoreEye = async (
    eyeLandmarks: faceapi.Point[],
    eyeType: 'left' | 'right',
    currentTime: number
  ) => {
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    const { x, y } = eyeLandmarks[0];
    const width = eyeLandmarks[3].x - eyeLandmarks[0].x;
    const height = eyeLandmarks[4].y - eyeLandmarks[1].y;

    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (ctx && video) {
      ctx.drawImage(video, x, y, width, height, 0, 0, width, height);

      return new Promise<void>((resolve) => {
        canvas.toBlob(async (blob) => {
          if (blob) {
            const timestamp = currentTime.toFixed(2).replace('.', '-');
            console.log(timestamp);
            const filename = `${eyeType}_eye_${timestamp}.png`;
            const arrayBuffer = await blob.arrayBuffer();
            if (eyeType === 'left') {
              leftEyeFolder?.file(filename, arrayBuffer);
            } else {
              rightEyeFolder?.file(filename, arrayBuffer);
            }
          }
          resolve();
        });
      });
    }
  };

  return { processVideo, progress, processing };
}

// Convert zip Blob to base64 string
const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64data = reader.result as string;
      resolve(base64data.split(',')[1]); // Remove data URL prefix
    };
    reader.onerror = (error) =>
      reject(`Error reading blob as base64: ${error}`);
    reader.readAsDataURL(blob);
  });
};

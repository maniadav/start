import { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import JSZip from 'jszip';
import { getIndexedDBValue, setIndexedDBValue } from '@utils/indexDB';
import { convertBase64ToFile } from '@helper/binaryConvertion';

export default function VideoDetection(): JSX.Element {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [processing, setProcessing] = useState<boolean>(false);
  const [videoFile, setVideoFile] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [videoLength, setVideoLength] = useState<number>(0);
  const zip = new JSZip();
  const leftEyeFolder = zip.folder('left-eye');
  const rightEyeFolder = zip.folder('right-eye');
  const framePerSecond: number = 30;

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

  useEffect(() => {
    const fetchVideoFromDB = async () => {
      try {
        const videoBase64: string =
          (await getIndexedDBValue('testing', 'videoBase64')) || '';

        if (videoBase64) {
          const videoBlob = convertBase64ToFile(videoBase64, 'video/webm');
          const videoURL = URL.createObjectURL(videoBlob);
          setVideoFile(videoURL);
        }
      } catch (error) {
        console.error('Error fetching video from IndexedDB:', error);
      }
    };

    fetchVideoFromDB();
  }, []);

  const processVideo = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    video.play();
    setVideoLength(video.duration * 1000);
    setProcessing(true);

    const interval = setInterval(async () => {
      if (video.currentTime >= video.duration) {
        clearInterval(interval);
        setProcessing(false);
        setProgress(100);
        downloadZip();
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
        cropAndStoreEye(leftEye, 'left', video.currentTime);
        cropAndStoreEye(rightEye, 'right', video.currentTime);
      }

      setProgress((video.currentTime / video.duration) * 100);
    }, 1000 / framePerSecond);
  };

  const cropAndStoreEye = (
    eyeLandmarks: faceapi.Point[],
    eyeType: 'left' | 'right',
    currentTime: number
  ) => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    const { x, y } = eyeLandmarks[0];
    const width = eyeLandmarks[3].x - eyeLandmarks[0].x;
    const height = eyeLandmarks[4].y - eyeLandmarks[1].y;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, x, y, width, height, 0, 0, width, height);
      canvas.toBlob(async (blob) => {
        if (blob) {
          const timestamp = currentTime.toFixed(2).replace('.', '-');
          const filename = `${eyeType}_eye_${timestamp}.png`;
          const arrayBuffer = await blob.arrayBuffer();
          if (eyeType === 'left') {
            leftEyeFolder?.file(filename, arrayBuffer);
          } else {
            rightEyeFolder?.file(filename, arrayBuffer);
          }
        }
      });
    }
  };

  // const downloadZip = async () => {
  //   try {
  //     const zipBlob = await zip.generateAsync({ type: 'blob' });

  //     // Convert Blob to base64
  //     const reader = new FileReader();
  //     reader.readAsDataURL(zipBlob);

  //     reader.onloadend = async () => {
  //       const base64Data = reader.result as string;

  //       await setIndexedDBValue('testing', 'eyeDetectionsZip', base64Data);

  //       const link = document.createElement('a');
  //       link.href = URL.createObjectURL(zipBlob);
  //       link.download = 'eye-detections.zip';
  //       link.style.display = 'none';
  //       document.body.appendChild(link);
  //       link.click();
  //       document.body.removeChild(link);
  //     };
  //   } catch (error) {
  //     console.error('Error saving or downloading zip file:', error);
  //   }
  // };

  const downloadZip = async () => {
    try {
      const zipBlob = await zip.generateAsync({ type: 'blob' });

      // Convert Blob to base64
      const reader = new FileReader();
      reader.readAsDataURL(zipBlob);

      reader.onloadend = async () => {
        const base64DataUrl = reader.result as string;

        // Remove the "data:application/zip;base64," prefix
        const base64Data = base64DataUrl.split(',')[1];

        // Save to IndexedDB without the prefix
        await setIndexedDBValue('testing', 'eyeDetectionsZip', base64Data);
        console.log('Zip file saved to IndexedDB successfully.');

        // Trigger download
        const link = document.createElement('a');
        link.href = URL.createObjectURL(zipBlob);
        link.download = 'eye-detections.zip';
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      };
    } catch (error) {
      console.error('Error saving or downloading zip file:', error);
    }
  };

  console.log({ videoFile });
  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div className="container w-full flex justify-center items-center">
        <button
          onClick={processVideo}
          disabled={processing || !videoFile}
          className="bg-gray-200 text-gray-900 p-2 rounded-md m-8"
        >
          {processing ? 'Processing...' : 'Start Eye Detection'}
        </button>
      </div>
      <div className="w-full flex justify-center container items-center mx-auto">
        {processing && (
          <div className="w-full max-w-xl p-4">
            <div className="flex justify-between mb-2">
              <span>Processing: {progress.toFixed(2)}%</span>
              <span>Video Length: {videoLength.toFixed(2)} ms</span>
            </div>
            <div className="w-full bg-gray-200 h-4 rounded-md">
              <div
                className="bg-blue-600 h-full rounded-md"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      <div className="container w-full flex flex-col justify-center items-center">
        {videoFile && (
          <video
            ref={videoRef}
            src={videoFile}
            controls
            className="w-auto h-auto"
            onLoadedMetadata={() => {
              if (videoRef.current) {
                setVideoLength(videoRef.current.duration * 1000);
              }
            }}
          />
        )}
      </div>
    </div>
  );
}

import { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import JSZip from 'jszip';
import { getIndexedDBValue, setIndexedDBValue } from '@utils/indexDB';
import { convertBase64ToFile } from '@helper/binaryConvertion';
import { useRouter } from 'next/navigation';

const VideoDetection = ({ reAttemptUrl }: any) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [processing, setProcessing] = useState<boolean>(false);
  const [videoFile, setVideoFile] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const zip = useRef(new JSZip()).current;
  const leftEyeFolder = useRef(zip.folder('left-eye')).current;
  const rightEyeFolder = useRef(zip.folder('right-eye')).current;
  const framePerSecond = 30;
  const router = useRouter();

  useEffect(() => {
    const loadModels = async () => {
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
          faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
        ]);
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

  useEffect(() => {
    if (videoFile) {
      processVideo();
    }
  }, [videoFile]);

  const processVideo = () => {
    if (!videoRef.current) return;
    setProcessing(true);
    const video = videoRef.current;
    video.play();

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

    return () => clearInterval(interval);
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

  const downloadZip = async () => {
    try {
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const reader = new FileReader();
      reader.readAsDataURL(zipBlob);

      reader.onloadend = async () => {
        try {
          const base64DataUrl = reader.result as string;
          const base64Data = base64DataUrl.split(',')[1];
          await setIndexedDBValue('testing', 'eyeDetectionsZip', base64Data);

          const link = document.createElement('a');
          link.href = URL.createObjectURL(zipBlob);
          link.download = 'eye-detections.zip';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } catch (saveError) {
          console.error('Error saving base64 data to IndexedDB:', saveError);
        }
      };

      reader.onerror = (readError) => {
        console.error('Error reading blob as base64:', readError);
      };
    } catch (error) {
      console.error('Error generating or downloading zip file:', error);
    }
  };

  const handleDownload = async () => {
    try {
      const zipBase64Data: string =
        (await getIndexedDBValue('testing', 'eyeDetectionsZip')) || '';
      if (zipBase64Data) {
        const zipBlob = convertBase64ToFile(zipBase64Data, 'application/zip');
        const url = URL.createObjectURL(zipBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'eye-detection.zip';
        link.click();
        URL.revokeObjectURL(url);
      } else {
        console.error('No zip data found in IndexedDB');
      }
    } catch (error) {
      console.error('Error downloading zip file:', error);
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div className="w-full flex items-start justify-between py-4 md:py-5 border-b rounded-t dark:border-gray-600">
        <h3 className="text-xl capitalize text-center font-semibold text-gray-900">
          {processing
            ? `Wait while we process the video.`
            : 'Hurray, You have completed the survey!'}
        </h3>
      </div>
      <div className="w-full flex justify-center container items-center mx-auto">
        <div className="w-full max-w-xl p-4">
          <div className="flex justify-between mb-2">
            <span>Processing: {progress.toFixed(2)}%</span>
          </div>
          <div className="w-full bg-gray-200 h-4 rounded-md">
            <div
              className="bg-blue-600 h-full rounded-md"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="container w-full flex flex-col justify-center items-center">
        {videoFile && (
          <video
            ref={videoRef}
            src={videoFile}
            controls
            className="w-auto h-auto"
          />
        )}
      </div>

      <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
        <button
          disabled={processing}
          onClick={() => router.push('/survey')}
          className={`${
            processing ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
          } capitalize text-white bg-red-800 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:hover:bg-red-700 dark:focus:ring-red-800`}
        >
          Go to Dashboard
        </button>

        {reAttemptUrl && (
          <button
            disabled={processing}
            onClick={() => router.push(reAttemptUrl)}
            className={`${
              processing ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
            } ms-3 text-gray-200 bg-gray-800 hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-red-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5`}
          >
            Create New Attempt
          </button>
        )}
      </div>
    </div>
  );
};

export default VideoDetection;

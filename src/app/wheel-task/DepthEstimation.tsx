'use client';
import { useState, useEffect, useRef } from 'react';
import {
  FaceLandmarker,
  FilesetResolver,
  DrawingUtils,
} from '@mediapipe/tasks-vision';
import { getIndexedDBValue } from '@utils/indexDB';
import { convertBase64ToFile } from '@helper/binaryConvertion';
import { useRouter } from 'next/navigation';
import { calculateDepth } from '@utils/mediapipe.utils';
import { useSurveyContext } from 'state/provider/SurveytProvider';
import { IndexDB_Storage } from '@constants/storage.constant';

// Define types for results and gaze data
type GazeResult = {
  timestamp: number;
  distance: number;
};

type BlendShapeData = {
  [key: string]: number;
};
type DepthEstimationInterface = {
  reAttemptUrl: string | null;
  showFilter: boolean;
  attempt: number;
  taskID: string;
};

const DepthEstimation = ({
  reAttemptUrl,
  showFilter,
  attempt,
  taskID,
}: DepthEstimationInterface) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [gazeResults, setGazeResults] = useState<GazeResult[]>([]);
  const [gazeTest] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(true);
  const [msg, setMsg] = useState<string>('');
  const { state, dispatch } = useSurveyContext();
  const FPS = 30;
  const faceLandmarkerRef = useRef<FaceLandmarker | null>(null);
  const drawingUtilsRef = useRef<DrawingUtils | null>(null);
  const router = useRouter();
  const cdn_file =
    'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'; //'model/mediapipe'; // or use

  useEffect(() => {
    if (showFilter) {
      createFaceLandmarker().then(() => {
        fetchVideoFromDB();
      });
    }
  }, [showFilter]);

  // model
  const createFaceLandmarker = async () => {
    setMsg('loading mediapipe model for gaze detection..');
    try {
      const filesetResolver = await FilesetResolver.forVisionTasks(cdn_file);

      faceLandmarkerRef.current = await FaceLandmarker.createFromOptions(
        filesetResolver,
        {
          baseOptions: {
            modelAssetPath:
              'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task',
            delegate: 'GPU',
          },
          outputFaceBlendshapes: true,
          runningMode: 'VIDEO',
          numFaces: 1,
        }
      );

      drawingUtilsRef.current = new DrawingUtils(
        canvasRef.current?.getContext('2d')!
      );
    } catch (error) {
      setMsg('error loading model');
      console.error(error);
      throw new Error('Unable to load model');
    }
  };

  // load video data
  const fetchVideoFromDB = async () => {
    setMsg('fetching video data..');
    try {
      const videoBase64: string | null = await getIndexedDBValue(
        IndexDB_Storage.temporaryDB,
        IndexDB_Storage.tempVideo
      );
      if (videoBase64) {
        const videoBlob = convertBase64ToFile(videoBase64, 'video/webm');
        const videoURL = URL.createObjectURL(videoBlob);
        if (videoRef.current) {
          videoRef.current.src = videoURL;
          videoRef.current.addEventListener('loadeddata', () => {
            processVideo();
          });
        }
      } else {
        setMsg(
          `couldn't retrive  key ${IndexDB_Storage.tempVideo} from ${IndexDB_Storage.temporaryDB} database. `
        );
      }
    } catch (error) {
      setMsg('Error fetching video from IndexedDB');
      console.error('Error fetching video from IndexedDB:', error);
    }
  };

  // process gaze
  const processVideo = async () => {
    setMsg('processing video...');
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvasElement = canvasRef.current;
    const canvasCtx = canvasElement.getContext('2d')!;
    const fixedWidth = 720;
    const fixedHeight = 400;

    video.width = fixedWidth;
    video.height = fixedHeight;
    canvasElement.width = fixedWidth;
    canvasElement.height = fixedHeight;

    let lastTimestamp = -1;

    const processFrame = async (timestamp: number) => {
      try {
        if (timestamp - lastTimestamp < 1000 / FPS) {
          requestAnimationFrame(processFrame);
          return;
        }
        lastTimestamp = timestamp;

        canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

        const startTimeMs = performance.now();

        if (
          !faceLandmarkerRef.current ||
          typeof faceLandmarkerRef.current.detectForVideo !== 'function'
        ) {
          throw new Error('faceLandmarkerRef.current model is unavailable');
        }

        const results = await faceLandmarkerRef.current.detectForVideo(
          video,
          startTimeMs
        );
        // console.log(results);
        if (results?.faceLandmarks && drawingUtilsRef.current) {
          for (const landmarks of results.faceLandmarks) {
            drawingUtilsRef.current.drawConnectors(
              landmarks,
              FaceLandmarker.FACE_LANDMARKS_TESSELATION,
              { color: '#C0C0C070', lineWidth: 1 }
            );
          }

          const landmarks = results.faceLandmarks[0];
          // check mediapipe_face_landmark_fullsize in public/model
          const leftEye = landmarks?.[33]; // coordinates of left corner of left eye
          const rightEye = landmarks?.[263]; // coordinates of right corner of right eye

          // Use the utility function to calculate depth
          const distance = calculateDepth({
            leftEye,
            rightEye,
          });

          // console.log(`Depth (Distance to Camera): ${distance.toFixed(2)} cm`);
          setMsg(`Distance bw eyes: ${distance.toFixed(2)} cm`);

          gazeResults.push({
            timestamp: parseFloat(video.currentTime.toFixed(3)),
            distance,
          });
        }
        // progress
        const progressPercentage = (video.currentTime / video.duration) * 100;
        setProgress(progressPercentage);

        if (!video.paused && !video.ended) {
          requestAnimationFrame(processFrame);
        } else {
          // downloadJSON(gazeResults, 'gaze depth');
          const updatedSurveyData = {
            ...state[taskID][`attempt${attempt}`],
            gazeData: gazeResults || {},
          };

          dispatch({
            type: 'UPDATE_SURVEY_DATA',
            attempt,
            task: taskID,
            data: updatedSurveyData,
          });
          setMsg('saving data');
          setIsProcessing(false);
        }
      } catch (error) {
        setMsg('Something went wrong while processing the video:');
        console.error(
          'Something went wrong while processing the video:',
          error
        );
        setIsProcessing(false);
      }
    };

    setIsProcessing(true); // Mark processing as started
    requestAnimationFrame(processFrame);
  };

  // const downloadJSON = (data: GazeResult[], filename: string) => {
  //   const json = JSON.stringify(data, null, 2);
  //   const blob = new Blob([json], { type: 'application/json' });
  //   const url = URL.createObjectURL(blob);
  //   const a = document.createElement('a');
  //   a.href = url;
  //   a.download = filename;
  //   document.body.appendChild(a);
  //   a.click();
  //   document.body.removeChild(a);
  // };

  return (
    <div className="w-full h-full bg-gray-800 flex items-center justify-center align-middle">
      <div className="w-full bg-white container max-w-3xl rounded-md">
        <div className="w-full flex items-start justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
          <h3 className="text-xl capitalize text-center font-semibold text-gray-900">
            {isProcessing
              ? `Wait while we process the video.`
              : 'Hurray, You have completed the survey!'}
          </h3>
        </div>
        {/* <div className="w-full flex justify-center items-center mx-auto">
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
        </div> */}
        <div className="p-4">
          {isProcessing && (
            <p
              id="eye-direction"
              className="text-center text-gray-400 text-base"
            >
              {msg}
            </p>
          )}
          <div className="w-full h-[300px] max-w-2xl m-auto flex flex-col items-center relative">
            <video
              className="absolute h-full w-full max-w-xl rounded-lg bg-gray-800"
              id="webcam"
              ref={videoRef}
              autoPlay
              playsInline
            >
              Your browser does not support the video tag.
            </video>
            <canvas
              className="absolute h-full w-full rounded-lg"
              id="output_canvas"
              ref={canvasRef}
            ></canvas>
            {isProcessing && <p>We are processing the video, please wait...</p>}
          </div>
        </div>
        <div className="w-full flex items-center justify-center p-4 border-t border-gray-200 rounded-b dark:border-gray-600">
          <button
            disabled={isProcessing}
            onClick={() => router.push('/survey')}
            className={`${
              isProcessing ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
            } capitalize text-white bg-red-800 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:hover:bg-red-700 dark:focus:ring-red-800`}
          >
            Go to Dashboard
          </button>

          {reAttemptUrl && (
            <button
              disabled={isProcessing}
              onClick={() => router.push(reAttemptUrl)}
              className={`${
                isProcessing
                  ? 'cursor-not-allowed opacity-50'
                  : 'cursor-pointer'
              } ms-3 text-gray-200 bg-gray-800 hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-red-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5`}
            >
              Create New Attempt
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DepthEstimation;

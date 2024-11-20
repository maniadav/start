import { useEffect, useState, useRef } from 'react';
import { FaceLandmarker, FilesetResolver, DrawingUtils } from '@mediapipe/tasks-vision';

// Define types for results and gaze data
type GazeResult = {
  timestamp: number;
  gazeDirection: string;
};

type BlendShapeData = {
  [key: string]: number;
};

export const useGazeTracking = () => {
  const [gazeResults, setGazeResults] = useState<GazeResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [base64Video, setBase64Video] = useState<string | null>(null);

  const faceLandmarkerRef = useRef<FaceLandmarker | null>(null);

  const FPS = 30;

  useEffect(() => {
    if (base64Video) {
      processGaze(base64Video);
    }
    return () => {
      faceLandmarkerRef.current?.close();
    };
  }, [base64Video]);

  const initializeFaceLandmarker = async () => {
    const filesetResolver = await FilesetResolver.forVisionTasks(
      'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm'
    );

    const faceLandmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
      baseOptions: {
        modelAssetPath:
          'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task',
        delegate: 'GPU',
      },
      outputFaceBlendshapes: true,
      runningMode: 'VIDEO',
      numFaces: 1,
    });

    faceLandmarkerRef.current = faceLandmarker;
  };

  const processGaze = async (base64: string) => {
    if (!faceLandmarkerRef.current) {
      await initializeFaceLandmarker();
    }

    const videoBlob = base64ToBlob(base64, 'video/mp4');
    const videoUrl = URL.createObjectURL(videoBlob);

    const video = document.createElement('video');
    video.src = videoUrl;
    video.autoplay = true;
    video.muted = true;

    video.addEventListener('loadeddata', () => {
      processVideo(video);
    });
  };

  const processVideo = async (video: HTMLVideoElement) => {
    if (!faceLandmarkerRef.current) return;

    setIsProcessing(true);

    const canvas = document.createElement('canvas');
    const canvasCtx = canvas.getContext('2d')!;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const drawingUtils = new DrawingUtils(canvasCtx);

    let lastTimestamp = -1;

    const processFrame = async (timestamp: number) => {
      if (timestamp - lastTimestamp < 1000 / FPS) {
        requestAnimationFrame(processFrame);
        return;
      }
      lastTimestamp = timestamp;

      canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

      const results = await faceLandmarkerRef.current!.detectForVideo(video, performance.now());

      if (results?.faceLandmarks) {
        for (const landmarks of results.faceLandmarks) {
          drawingUtils.drawConnectors(
            landmarks,
            FaceLandmarker.FACE_LANDMARKS_TESSELATION,
            { color: '#C0C0C070', lineWidth: 1 }
          );
        }

        const gazeDirection = detectGazeDirection(results.faceBlendshapes);
        setGazeResults((prev) => [
          ...prev,
          { timestamp: parseFloat(video.currentTime.toFixed(3)), gazeDirection },
        ]);
      }

      if (!video.paused && !video.ended) {
        requestAnimationFrame(processFrame);
      } else {
        video.remove(); // Clean up video element
        setIsProcessing(false);
      }
    };

    requestAnimationFrame(processFrame);
  };

  const detectGazeDirection = (blendShapesData: any): string => {
    if (!blendShapesData || !blendShapesData.length) return 'No eye detected';

    const blendShapes = blendShapesData[0].categories;
    const eyeKeys = [
      'eyeLookInLeft',
      'eyeLookInRight',
      'eyeLookOutLeft',
      'eyeLookOutRight',
    ];

    const eyeData: BlendShapeData = blendShapes.reduce(
      (acc: BlendShapeData, { categoryName, score }: any) => {
        if (eyeKeys.includes(categoryName)) {
          acc[categoryName] = score;
        }
        return acc;
      },
      {}
    );

    return determineGazeDirection(eyeData);
  };

  const determineGazeDirection = (data: BlendShapeData): string => {
    const { eyeLookInLeft, eyeLookInRight, eyeLookOutLeft, eyeLookOutRight } = data;

    if (
      eyeLookInLeft === undefined ||
      eyeLookInRight === undefined ||
      eyeLookOutLeft === undefined ||
      eyeLookOutRight === undefined
    ) {
      return 'No eye detected';
    }

    const centerThreshold = 0.2;

    if (eyeLookInRight > eyeLookInLeft && eyeLookOutLeft > eyeLookOutRight) {
      return 'Right';
    } else if (eyeLookInLeft > eyeLookInRight && eyeLookOutRight > eyeLookOutLeft) {
      return 'Left';
    } else if (
      Math.abs(eyeLookInLeft - eyeLookInRight) < centerThreshold &&
      Math.abs(eyeLookOutLeft - eyeLookOutRight) < centerThreshold
    ) {
      return 'Center';
    } else {
      return 'Uncertain';
    }
  };

  const base64ToBlob = (base64: string, mimeType: string): Blob => {
    const byteString = atob(base64.split(',')[1]);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uint8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      uint8Array[i] = byteString.charCodeAt(i);
    }
    return new Blob([arrayBuffer], { type: mimeType });
  };

  return { gazeResults, isProcessing, setBase64Video };
};

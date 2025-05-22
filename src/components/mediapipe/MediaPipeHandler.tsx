"use client";
import { useState, useEffect, useRef } from "react";
import {
  FaceLandmarker,
  FilesetResolver,
  DrawingUtils,
} from "@mediapipe/tasks-vision";
import { getIndexedDBValue } from "@utils/indexDB";
import { convertBase64ToFile } from "@helper/binaryConvertion";
import { useRouter } from "next/navigation";
import { calculateDepth, getGazeDirection } from "@utils/mediapipe.utils";
import { useSurveyContext } from "state/provider/SurveytProvider";
import { IndexDB_Storage } from "@constants/storage.constant";
import { downloadFile } from "@helper/downloader";
import { BASE_URL } from "@constants/config.constant";
import { TasksConstant } from "@constants/tasks.constant";

type MediaPipeHandlerInterface = {
  reAttemptUrl: string | null;
  showFilter: boolean;
  attempt: number;
  taskID: string;
  videoURL?: string;
};

const MediaPipeHandler = ({
  reAttemptUrl,
  showFilter,
  attempt,
  taskID,
  videoURL,
}: MediaPipeHandlerInterface) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [gazeMainData, setGazeMainData] = useState<(number | string)[]>([0]);
  const [gazeTiming, setGazeTiming] = useState<number[]>([0]);
  const [gazeVidType] = useState<string[]>(["initial"]);
  const [isProcessing, setIsProcessing] = useState<boolean>(true);
  const videoTypes: string[] = [
    "social",
    "nonsocial",
    "social",
    "nonsocial",
    "nonsocial",
    "social",
  ]; // 1 = social, 0 = non-social. each vid is 5 sec long
  const [msg, setMsg] = useState<string>("");
  const { state, dispatch } = useSurveyContext();
  const FPS = 30;
  const faceLandmarkerRef = useRef<FaceLandmarker | null>(null);
  const drawingUtilsRef = useRef<DrawingUtils | null>(null);
  const router = useRouter();

  //  "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"; //'model/mediapipe'; // or use
  // task vision local files instead of CDN
  const cdn_file = `${BASE_URL}/model/mediapipe/task-vision`;
  //     "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
  const modelPath = `${BASE_URL}/model/mediapipe/face-landmark/face_landmarker.task`; // Local development path,

  useEffect(() => {
    if (showFilter) {
      createFaceLandmarker().then(() => {
        fetchVideoData();
      });
    }
  }, [showFilter]);

  // model
  const createFaceLandmarker = async () => {
    setMsg("Loading MediaPipe model for gaze detection...");
    try {
      const filesetResolver = await FilesetResolver.forVisionTasks(cdn_file);

      // First try with GPU
      try {
        faceLandmarkerRef.current = await FaceLandmarker.createFromOptions(
          filesetResolver,
          {
            baseOptions: {
              modelAssetPath: modelPath,
              delegate: "GPU",
            },
            outputFaceBlendshapes: true,
            runningMode: "VIDEO",
            numFaces: 1,
          }
        );
      } catch (gpuError) {
        console.warn("GPU acceleration failed, falling back to CPU:", gpuError);
        // Fallback to CPU if GPU fails
        faceLandmarkerRef.current = await FaceLandmarker.createFromOptions(
          filesetResolver,
          {
            baseOptions: {
              modelAssetPath: modelPath,
              delegate: "CPU",
            },
            outputFaceBlendshapes: true,
            runningMode: "VIDEO",
            numFaces: 1,
          }
        );
      }

      drawingUtilsRef.current = new DrawingUtils(
        canvasRef.current?.getContext("2d")!
      );
      setMsg("Model loaded successfully");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      setMsg(`Error loading model: ${errorMessage}`);
      console.error("Detailed error:", error);
      throw new Error("Unable to load face landmark model");
    }
  };

  const fetchVideoData = async () => {
    setMsg("Fetching video data...");

    try {
      if (videoURL) {
        // fetch testing video
        if (videoRef.current) {
          videoRef.current.src = videoURL;
          videoRef.current.addEventListener("loadeddata", () => {
            processVideo();
          });
        }
        return;
      }

      // Fetch from IndexedDB if no relative URL is provided
      const videoBase64: string | null = await getIndexedDBValue(
        IndexDB_Storage.temporaryDB,
        IndexDB_Storage.tempVideo
      );

      if (videoBase64) {
        const videoBlob = convertBase64ToFile(videoBase64, "video/webm");
        const videoURL = URL.createObjectURL(videoBlob);
        if (videoRef.current) {
          videoRef.current.src = videoURL;
          videoRef.current.addEventListener("loadeddata", () => {
            processVideo();
          });
        }
      } else {
        setMsg(`Unable to fetch video data. Please try again later.`);
        setIsProcessing(false);
      }
    } catch (error) {
      setMsg("Error fetching video");
      setIsProcessing(false);
      console.error("Error fetching video:", error);
    }
  };

  // process gaze
  const processVideo = async () => {
    setMsg("processing video...");
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvasElement = canvasRef.current;
    const canvasCtx = canvasElement.getContext("2d")!;
    const fixedWidth = 720;
    const fixedHeight = 400;

    video.width = fixedWidth;
    video.height = fixedHeight;
    canvasElement.width = fixedWidth;
    canvasElement.height = fixedHeight;

    // ensure consistent timing
    video.playbackRate = 1.0;

    try {
      await video.play();
    } catch (error) {
      setMsg("Error playing video");
      console.error("Error playing video:", error);
      return;
    }

    let frameCount = 0;
    // Pause video initially
    video.pause();

    const processFrame = async () => {
      try {
        const currentTime = video.currentTime;

        canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

        if (
          !faceLandmarkerRef.current ||
          typeof faceLandmarkerRef.current.detectForVideo !== "function"
        ) {
          throw new Error("faceLandmarkerRef.current model is unavailable");
        }

        let mainData: number | string = "no-eye-detected";
        let currentVidType: string | undefined = undefined;
        try {
          const results = faceLandmarkerRef.current.detectForVideo(
            video,
            performance.now()
          );

          if (results?.faceLandmarks?.[0] && drawingUtilsRef.current) {
            for (const landmarks of results.faceLandmarks) {
              drawingUtilsRef.current.drawConnectors(
                landmarks,
                FaceLandmarker.FACE_LANDMARKS_TESSELATION,
                { color: "#C0C0C070", lineWidth: 1 }
              );
            }

            const landmarks = results.faceLandmarks[0];
            if (taskID == TasksConstant.WheelTask.id) {
              mainData = calculateDepth(landmarks);
              setMsg(
                `Frame: ${frameCount}, Projected Distance: ${mainData.toFixed(
                  2
                )}, Time: ${currentTime.toFixed(3)}s`
              );
            } else {
              mainData = getGazeDirection(landmarks);
              setMsg(`Looking ${mainData}`);
              const timestamp: number = parseFloat(currentTime.toFixed(3)) || 0;
              setMsg(
                `Frame: ${frameCount}, Direction: ${mainData}, Time: ${currentTime.toFixed(
                  3
                )}s`
              );

              // 5-second segment of vid frame,0-5 sec -> segment 0, 5-10 sec -> segment 1
              const vidSegmentIndex = Math.floor(timestamp / 5);

              if (vidSegmentIndex < videoTypes.length) {
                currentVidType = videoTypes[vidSegmentIndex];
                // If the gaze direction is left, flip the video type as we only consider what type is on right side
                if (mainData === "left") {
                  currentVidType =
                    currentVidType === "social" ? "nonsocial" : "social";
                }
              }
            }
          } else {
            // No face/eye detected
            setMsg(
              `Frame: ${frameCount}, No eye detected, Time: ${currentTime.toFixed(
                3
              )}s`
            );
          }
        } catch (detectionError) {
          console.warn("Frame detection error:", detectionError);
        }

        gazeVidType.push(currentVidType || "no-eye-detected");
        gazeTiming.push(currentTime);
        gazeMainData.push(mainData || "no-eye-detected");

        const progressPercentage = (currentTime / video.duration) * 100;
        setProgress(progressPercentage);

        // Check if we've reached the end of the video
        if (currentTime >= video.duration) {
          downloadFile(gazeMainData, "gaze-data");

          let updatedSurveyData;
          if (taskID == TasksConstant.WheelTask.id) {
            updatedSurveyData = {
              ...state[taskID][`attempt${attempt}`],
              gazeDistance: gazeMainData,
              gazeTiming,
              videoDuration: video.duration,
              totalFramesProcessed: frameCount,
            };
          } else {
            updatedSurveyData = {
              ...state[taskID][`attempt${attempt}`],
              gazeDirection: gazeMainData,
              gazeTiming,
              gazeVidType,
              videoDuration: video.duration,
              totalFramesProcessed: frameCount,
            };
          }

          dispatch({
            type: "UPDATE_SURVEY_DATA",
            attempt,
            task: taskID,
            data: updatedSurveyData,
          });
          setMsg("Processing complete! Data saved.");
          setIsProcessing(false);
          return;
        }

        // Move to next frame
        const nextFrameTime = Math.min(currentTime + 1 / FPS, video.duration);
        video.currentTime = nextFrameTime;
      } catch (error) {
        console.error("Frame processing error:", error);
        setMsg(`Error processing frame ${frameCount}: ${error}`);
      } finally {
        frameCount++;
      }
    };

    // Function to handle timeupdate event
    const handleTimeUpdate = async () => {
      await processFrame();
    };

    // Add timeupdate event listener
    video.addEventListener("timeupdate", handleTimeUpdate);

    // Start processing by setting initial time
    setIsProcessing(true);
    video.currentTime = 0;

    // Cleanup function
    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
    };
  };

  return (
    <div className="w-full h-full bg-gray-800 flex items-center justify-center align-middle">
      <div className="w-full bg-white container max-w-3xl rounded-md">
        <div className="w-full flex items-start justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
          <h3 className="text-xl capitalize text-center font-semibold text-gray-900">
            {isProcessing
              ? `Wait while we process the video.`
              : "Hurray, You have completed the survey!"}
          </h3>
        </div>
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
              playsInline
              muted
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
          {/* Add progress bar */}
          {isProcessing && (
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          )}
        </div>
        <div className="w-full flex items-center justify-center p-4 border-t border-gray-200 rounded-b dark:border-gray-600">
          <button
            disabled={isProcessing}
            onClick={() => router.push("/survey")}
            className={`${
              isProcessing ? "cursor-not-allowed opacity-50" : "cursor-pointer"
            } capitalize text-white bg-red-800 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:hover:bg-red-700 dark:focus:ring-red-800`}
          >
            Go to Dashboard
          </button>

          {reAttemptUrl && (
            <button
              disabled={isProcessing}
              onClick={() => {
                if (!isProcessing && window.location) {
                  window.location.href = reAttemptUrl;
                }
              }}
              className={`${
                isProcessing
                  ? "cursor-not-allowed opacity-50"
                  : "cursor-pointer"
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

export default MediaPipeHandler;

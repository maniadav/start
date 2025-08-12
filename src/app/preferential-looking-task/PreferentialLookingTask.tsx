"use client";
import { useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback, useRef } from "react";
import { timer } from "@utils/timer";
import { useSurveyContext } from "state/provider/SurveytProvider";
import useWindowSize from "@hooks/useWindowSize";
import CloseGesture from "components/CloseGesture";
import useVideoRecorder from "@hooks/useVideoRecorder";
import VidProcessingPopup from "components/common/VidProcessingPopup";
import { PreferentialLookingContent as TaskContent } from "@constants/tasks.constant";
import { BASE_URL } from "@constants/config.constant";

const PreferentialLookingTask = ({ isSurvey = false }) => {
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [alertShown, setAlertShown] = useState(false);
  const [timerData, setTimerData] = useState<{
    startTime: string;
    endTime: string;
    timeLimit: number;
    isTimeOver: boolean;
  } | null>(null);
  const [surveyData, setSurveyData] = useState<any>({});
  const { windowSize, deviceType } = useWindowSize();
  const { state, dispatch } = useSurveyContext();
  const searchParams = useSearchParams();
  const attemptString = searchParams.get("attempt") || "0";
  const attempt = parseInt(attemptString);
  const reAttemptUrl =
    attempt < 3
      ? `${BASE_URL}/${TaskContent.surveyRoute}?attempt=${attempt + 1}`
      : null;
  const timeLimit = 30000; // 30 seconds, considering video lenngth
  const { startVidRecording, stopVidRecording, CameraPermissionPopupUI } =
    useVideoRecorder();

  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoDuration, setVideoDuration] = useState<number>(timeLimit);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      // Set up an event listener for when metadata is loaded
      videoElement.onloadedmetadata = () => {
        const durationInMilliseconds = videoElement.duration * 1000;
        setVideoDuration(durationInMilliseconds);
      };
    }

    return () => {
      if (videoElement) {
        videoElement.onloadedmetadata = null;
      }
    };
  }, []);

  useEffect(() => {
    if (isSurvey) {
      handleStartGame();
    }
  }, [isSurvey]);

  useEffect(() => {
    if (timerData?.isTimeOver && !alertShown) {
      closeGame(timerData);
      setAlertShown(true);
    }
  }, [alertShown, timerData]);

  const handleStartGame = async () => {
    await startVidRecording();
    handleTimer();
  };

  const stopTimerFuncRef = useRef<() => any>();

  const handleTimer = () => {
    const { endTimePromise, stopTimer } = timer(videoDuration);

    stopTimerFuncRef.current = stopTimer;

    endTimePromise.then(setTimerData);

    return () => {
      // Optional cleanup if necessary
      stopTimerFuncRef.current && stopTimerFuncRef.current();
    };
  };

  const handleStopTimer = useCallback(() => {
    if (stopTimerFuncRef.current) {
      const data = stopTimerFuncRef.current();
      return data;
    }
  }, []);

  const closeGame = useCallback(
    async (timeData?: any, closedMidWay: boolean = false) => {
      if (isSurvey) {
        const videoData = await stopVidRecording();

        setShowPopup((prev) => {
          return !prev;
        });
        setSurveyData((prevState: any) => {
          const updatedSurveyData = {
            ...prevState,
            timrLimit: timeData?.timeLimit || "",
            endTime: timeData?.endTime || "",
            startTime: timeData?.startTime || "",
            closedWithTimeout: timeData?.isTimeOver || false,
            screenHeight: windowSize.height,
            screenWidth: windowSize.width,
            closedMidWay,
            deviceType,
          };

          dispatch({
            type: "UPDATE_SURVEY_DATA",
            attempt,
            task: TaskContent.id,
            data: updatedSurveyData,
          });

          return updatedSurveyData;
        });
      }
    },

    [isSurvey, timerData, attempt, showPopup]
  );

  const handleCloseMidWay = () => {
    const timeData = handleStopTimer();
    closeGame(timeData, true);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {CameraPermissionPopupUI}
      {isSurvey && <CloseGesture handlePressAction={handleCloseMidWay} />}
      <div className="w-screen h-screen relative bg-black">
        <video
          ref={videoRef}
          className="absolute top-0 left-0 w-full h-full object-fit"
          autoPlay
          muted
        >
          <source
            src={`${BASE_URL}/video/${
              isSurvey ? "start-plt.mp4" : "plt-sample.mp4"
            }`}
            type="video/mp4"
          />
        </video>
      </div>

      {isSurvey && (
        <VidProcessingPopup
          showFilter={showPopup}
          onProcessComplete={setShowPopup}
          reAttemptUrl={reAttemptUrl}
          attempt={attempt}
          taskID={TaskContent.id}
        />
      )}
    </div>
  );
};

export default PreferentialLookingTask;

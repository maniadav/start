"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback, useRef } from "react";
import { timer } from "@utils/timer";
import { useSurveyContext } from "state/provider/SurveytProvider";
import useWindowSize from "@hooks/useWindowSize";
import CloseGesture from "components/CloseGesture";
import useVideoRecorder from "@hooks/useVideoRecorder";
import VidProcessingPopup from "@components/ui/VidProcessingPopup";
import { PreferentialLookingContent as TaskContent } from "@constants/tasks.constant";
import { BASE_URL } from "@constants/config.constant";
import { SURVEY_MAX_ATTEMPTS } from "@constants/survey.config.constant";
import { PAGE_ROUTES } from "@constants/route.constant";

const PreferentialLookingTask = ({ isSurvey = false }) => {
  // State declarations
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [alertShown, setAlertShown] = useState(false);
  const [timerData, setTimerData] = useState<{
    startTime: string;
    endTime: string;
    timeLimit: number;
    isTimeOver: boolean;
  } | null>(null);
  const [surveyData, setSurveyData] = useState<any>({});
  const [showPopupActionButton, setPopupActionButton] =
    useState<boolean>(false);
  const { windowSize, deviceType } = useWindowSize();
  const { state, dispatch } = useSurveyContext();
  const timeLimit = 30000;
  const router = useRouter();
  const noOfAttemptFromState =
    parseInt(state[TaskContent.id]?.noOfAttempt) || 0;
  const currentAttempt = noOfAttemptFromState + 1;
  const { startVidRecording, stopVidRecording, CameraPermissionPopupUI } =
    useVideoRecorder();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoDuration, setVideoDuration] = useState<number>(timeLimit);
  const stopTimerFuncRef = useRef<() => any>();

  // Effects
  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
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

  // Handlers
  const handleStartGame = async () => {
    await startVidRecording();
    handleTimer();
  };

  const handleTimer = () => {
    const { endTimePromise, stopTimer } = timer(videoDuration);
    stopTimerFuncRef.current = stopTimer;
    endTimePromise.then(setTimerData);
    return () => {
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
        if (currentAttempt > SURVEY_MAX_ATTEMPTS) {
          alert(
            `Max attempts (${SURVEY_MAX_ATTEMPTS}) exceeded, navigating to survey page`
          );
          router.push(PAGE_ROUTES.SURVEY.path);
          return;
        }
        setPopupActionButton(currentAttempt < SURVEY_MAX_ATTEMPTS);
        const videoData = await stopVidRecording();
        setShowPopup((prev) => !prev);
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
            attempt: currentAttempt,
            task: TaskContent.id,
            data: updatedSurveyData,
          });
          return updatedSurveyData;
        });
      }
    },
    [
      isSurvey,
      windowSize,
      deviceType,
      dispatch,
      currentAttempt,
      router,
      stopVidRecording,
    ]
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
          showPopupActionButton={showPopupActionButton}
          taskID={TaskContent.id}
          attempt={currentAttempt}
        />
      )}
    </div>
  );
};

export default PreferentialLookingTask;

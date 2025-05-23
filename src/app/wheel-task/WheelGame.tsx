"use client";
import { useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback, useRef } from "react";
import { timer } from "@utils/timer";
import { useSurveyContext } from "state/provider/SurveytProvider";
import useWindowSize from "@hooks/useWindowSize";
import useVideoRecorder from "@hooks/useVideoRecorder";
import CloseGesture from "components/CloseGesture";
import DepthEstimation from "./DepthEstimation";
import { WheelContent as TaskContent } from "@constants/tasks.constant";
import { BASE_URL } from "@constants/config.constant";
import { PopupModal } from "components/common/PopupModal";
import VidProcessingPopup from "components/common/VidProcessingPopup";

const WheelTask = ({ isSurvey = false }) => {
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
  const { startVidRecording, stopVidRecording, CameraPermissionPopupUI } =
    useVideoRecorder();
  const { state, dispatch } = useSurveyContext();
  const searchParams = useSearchParams();
  const attemptString = searchParams.get("attempt") || "0";
  const attempt = parseInt(attemptString);
  const reAttemptUrl =
    attempt < 3
      ? `${BASE_URL}/${TaskContent.surveyRoute}?attempt=${attempt + 1}`
      : null;
  const timeLimit = 30000; // 30 sec

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
    const { endTimePromise, stopTimer } = timer(timeLimit);

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
        setShowPopup(true);
        setSurveyData((prevState: any) => {
          const updatedSurveyData = {
            ...prevState,
            timeLimit: timeData?.timeLimit || "",
            timeTaken: timeData?.timeTaken || "",
            endTime: timeData?.endTime || "",
            startTime: timeData?.startTime || "",
            closedWithTimeout: timeData?.isTimeOver || false,
            screenHeight: windowSize.height,
            screenWidth: windowSize.width,
            deviceType,
            closedMidWay,
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
    [isSurvey, timerData, attempt, windowSize, deviceType]
  );

  const handleCloseGame = () => {
    if (isSurvey) {
      const timeData = handleStopTimer();
      closeGame(timeData);
    } else {
      alert("you may start the game!");
    }
  };
  const handleCloseMidWay = () => {
    const timeData = handleStopTimer();
    closeGame(timeData, true);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {CameraPermissionPopupUI}
      {isSurvey && <CloseGesture handlePressAction={handleCloseMidWay} />}
      <div className="relative h-screen w-full">
        <video
          src={`${BASE_URL}/video/wheel.mp4`}
          className="absolute top-0 left-0 w-full h-full object-fit"
          autoPlay
          muted
        >
          <source src={`${BASE_URL}/gif/plt.gif`} type="video/mp4" />
        </video>
      </div>

      <div className="absolute bottom-5 left-5">
        <button
          className="border border-black shadow-lg rounded-full bg-primary w-16 h-16 px-2 py-1 animate-recPulse "
          onClick={handleCloseGame}
        ></button>
      </div>
      {/* {isSurvey && (
        <PopupModal show={showPopup}>
          <DepthEstimation
            showFilter={showPopup}
            reAttemptUrl={reAttemptUrl}
            attempt={attempt}
            taskID={TaskContent.id}
          />
        </PopupModal>
      )} */}
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

export default WheelTask;

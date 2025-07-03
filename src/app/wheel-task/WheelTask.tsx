"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { timer } from "@utils/timer";
import { useSurveyContext } from "state/provider/SurveytProvider";
import useWindowSize from "@hooks/useWindowSize";
import useVideoRecorder from "@hooks/useVideoRecorder";
import CloseGesture from "components/CloseGesture";
import { WheelContent as TaskContent } from "@constants/tasks.constant";
import { BASE_URL } from "@constants/config.constant";
import VidProcessingPopup from "components/common/VidProcessingPopup";
import { SURVEY_MAX_ATTEMPTS } from "@constants/survey.config.constant";
import { PAGE_ROUTES } from "@constants/route.constant";
import { useRouter } from "next/navigation";

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

  const [showPopupActionButton, setPopupActionButton] =
    useState<boolean>(false);
  // Get the current attempt directly from state
  const noOfAttemptFromState =
    parseInt(state[TaskContent.id]?.noOfAttempt) || 0;
  const currentAttempt = noOfAttemptFromState + 1;
  const router = useRouter();
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
        // Navigate to survey page if attempts exceed maximum
        if (currentAttempt > SURVEY_MAX_ATTEMPTS) {
          alert(
            `Max attempts (${SURVEY_MAX_ATTEMPTS}) exceeded, navigating to survey page`
          );
          router.push(PAGE_ROUTES.SURVEY.path);
          return;
        }
        setPopupActionButton(currentAttempt < SURVEY_MAX_ATTEMPTS);
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
            attempt: currentAttempt,
            task: TaskContent.id,
            data: updatedSurveyData,
          });

          return updatedSurveyData;
        });
      }
    },
    [isSurvey, timerData, currentAttempt, windowSize, deviceType]
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

export default WheelTask;

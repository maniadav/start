"use client";
import { useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import MessagePopup from "components/common/MessagePopup";
import { timer } from "@utils/timer";
import { useSurveyContext } from "state/provider/SurveytProvider";
import useWindowSize from "@hooks/useWindowSize";
import ProgressiveCircle from "./ProgrgessiveCircle";
import CloseGesture from "components/CloseGesture";
import { DelayedGratificationContent as TaskContent } from "@constants/tasks.constant";
import { BASE_URL } from "@constants/config.constant";
import { DGTAttemptDataType, TimerDataType } from "types/survey.types";

/**
 * DelayedGratificationTask - A component that tests a user's ability to delay gratification
 * The user can either wait for the circle to complete or click the star to end the task early
 */
const DelayedGratificationTask = ({ isSurvey = false }) => {
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [circleCompStatus, setCircleCompStatus] = useState<boolean>(false);
  const [showFireWorks, setShowFireWorks] = useState<boolean>(false);
  const [alertShown, setAlertShown] = useState<boolean>(false);
  const [timerData, setTimerData] = useState<TimerDataType | null>(null);
  const [surveyData, setSurveyAttemptData] = useState<
    Partial<DGTAttemptDataType>
  >({});

  const { windowSize, deviceType } = useWindowSize();
  const { dispatch } = useSurveyContext();
  const searchParams = useSearchParams();
  const attemptString = searchParams.get("attempt") || "0";
  const attempt = parseInt(attemptString);
  const reAttemptUrl =
    attempt < 3
      ? `${BASE_URL}/${TaskContent.surveyRoute}?attempt=${attempt + 1}`
      : null;

  const timeLimit = 180000;

  // Stop timer ref to store and access the timer stop function
  const stopTimerFuncRef = useRef<() => TimerDataType | undefined>();

  const handleTimer = useCallback(() => {
    const { endTimePromise, stopTimer } = timer(timeLimit);

    stopTimerFuncRef.current = stopTimer;

    // Use a local variable to track component mount status
    let isMounted = true;

    endTimePromise.then((data) => {
      // Only update state if the component is still mounted
      if (isMounted) {
        setTimerData(data);
      }
    });

    return () => {
      // Mark as unmounted to prevent state updates after unmounting
      isMounted = false;
      // Clean up timer
      stopTimerFuncRef.current && stopTimerFuncRef.current();
    };
  }, [timeLimit]);

  const handleStartGame = useCallback(() => {
    handleTimer();
  }, [handleTimer]);

  const handleStopTimer = useCallback(() => {
    if (stopTimerFuncRef.current) {
      return stopTimerFuncRef.current();
    }
    return undefined;
  }, []);

  const closeGame = useCallback(
    (timeData?: TimerDataType, closedMidWay: boolean = false) => {
      if (!isSurvey || !timeData) return;

      setShowPopup(true);
      setSurveyAttemptData((prevState: any) => {
        const updatedSurveyData = {
          ...prevState,
          timeTaken: timeData?.timeTaken || "",
          timeLimit: timeData?.timeLimit || "",
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
    },
    [isSurvey, attempt, windowSize, deviceType, dispatch]
  );

  const handleCloseGame = useCallback(() => {
    if (isSurvey) {
      setShowFireWorks(true);
      const timeData = handleStopTimer();
      if (timeData) {
        closeGame(timeData);
      }
    }
  }, [isSurvey, handleStopTimer, closeGame]);

  const handleCloseMidWay = useCallback(() => {
    const timeData = handleStopTimer();
    if (timeData) {
      closeGame(timeData, true);
    }
  }, [handleStopTimer, closeGame]);

  const closeGameOnCircleCompStatus = useCallback(() => {
    if (isSurvey) {
      setCircleCompStatus(true);
      setShowFireWorks(true);

      // Add a 5-second delay for fireworks to show before closing the game
      const timerId = setTimeout(handleCloseGame, 5000);

      // Return cleanup function to prevent memory leak if component unmounts
      return () => clearTimeout(timerId);
    }
  }, [isSurvey, handleCloseGame]);

  // Start the game when in survey mode
  useEffect(() => {
    if (isSurvey) {
      handleStartGame();
    }
  }, [isSurvey, handleStartGame]);

  // Handle timer completion
  useEffect(() => {
    if (timerData?.isTimeOver && !alertShown) {
      closeGame(timerData);
      setAlertShown(true);
    }
  }, [timerData, alertShown, closeGame]);

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {isSurvey && <CloseGesture handlePressAction={handleCloseMidWay} />}
      {circleCompStatus && showFireWorks ? (
        <div className="w-screen h-screen relative bg-black">
          <video
            className="absolute top-0 left-0 w-full h-full object-fit"
            autoPlay
          >
            <source src={`${BASE_URL}/video/firework.mp4`} type="video/mp4" />
          </video>
        </div>
      ) : (
        <div
          className="w-52 h-52 top-40 left-32 absolute cursor-pointer z-60"
          onClick={handleCloseGame}
        >
          <Image
            width={600}
            height={600}
            src={`${BASE_URL}/gif/star.gif`}
            alt="Star for delayed gratification task"
            className="border-b"
            priority
          />
        </div>
      )}

      <div className="top-1/2 relative w-full flex justify-center align-middle items-center gap-20">
        <div className="absolute">
          <ProgressiveCircle
            durationMs={60000} // 60 seconds
            handleCircleComplete={closeGameOnCircleCompStatus}
          />
        </div>
      </div>

      {isSurvey && (
        <MessagePopup
          showFilter={showPopup}
          msg={TaskContent.taskMessage}
          testName={TaskContent.title}
          reAttemptUrl={reAttemptUrl}
        />
      )}
    </div>
  );
};

export default DelayedGratificationTask;

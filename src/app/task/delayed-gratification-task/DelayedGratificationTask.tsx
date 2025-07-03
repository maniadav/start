"use client";
import { useRouter, useSearchParams } from "next/navigation";
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
import {
  SURVEY_MAX_ATTEMPTS,
  SURVEY_MAX_DURATION,
} from "@constants/survey.config.constant";
import { PAGE_ROUTES } from "@constants/route.constant";

const DelayedGratificationTask = ({ isSurvey = false }) => {
  // State declarations
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [circleCompStatus, setCircleCompStatus] = useState<boolean>(false);
  const [showFireWorks, setShowFireWorks] = useState<boolean>(false);
  const [alertShown, setAlertShown] = useState<boolean>(false);
  const [timerData, setTimerData] = useState<TimerDataType | null>(null);
  const [surveyData, setSurveyAttemptData] = useState<
    Partial<DGTAttemptDataType>
  >({});
  const { windowSize, deviceType } = useWindowSize();
  const { state, dispatch } = useSurveyContext();
  const router = useRouter();
  const [showPopupActionButton, setPopupActionButton] =
    useState<boolean>(false);
  const noOfAttemptFromState =
    parseInt(state[TaskContent.id]?.noOfAttempt) || 0;
  const currentAttempt = noOfAttemptFromState + 1;
  const stopTimerFuncRef = useRef<() => TimerDataType | undefined>();

  // Timer handler
  const handleTimer = useCallback(() => {
    const { endTimePromise, stopTimer } = timer(SURVEY_MAX_DURATION);
    stopTimerFuncRef.current = stopTimer;
    let isMounted = true;
    endTimePromise.then((data) => {
      if (isMounted) {
        setTimerData(data);
      }
    });
    return () => {
      isMounted = false;
      stopTimerFuncRef.current && stopTimerFuncRef.current();
    };
  }, []);

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
      if (currentAttempt > SURVEY_MAX_ATTEMPTS) {
        alert(
          `Max attempts (${SURVEY_MAX_ATTEMPTS}) exceeded, navigating to survey page`
        );
        router.push(PAGE_ROUTES.SURVEY.path);
        return;
      }
      setPopupActionButton(currentAttempt < SURVEY_MAX_ATTEMPTS);
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
          attempt: currentAttempt,
          task: TaskContent.id,
          data: updatedSurveyData,
        });
        return updatedSurveyData;
      });
    },
    [
      isSurvey,
      currentAttempt,
      windowSize,
      deviceType,
      dispatch,
      currentAttempt,
      router,
    ]
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
      const timerId = setTimeout(handleCloseGame, 5000);
      return () => clearTimeout(timerId);
    }
  }, [isSurvey, handleCloseGame]);

  // Effects
  useEffect(() => {
    if (isSurvey) {
      handleStartGame();
    }
  }, [isSurvey, handleStartGame]);

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
            durationMs={60000}
            handleCircleComplete={closeGameOnCircleCompStatus}
          />
        </div>
      </div>
      {isSurvey && (
        <MessagePopup
          showFilter={showPopup}
          msg={TaskContent.taskEndMessage}
          testName={TaskContent.title}
          showAction={showPopupActionButton}
        />
      )}
    </div>
  );
};

export default DelayedGratificationTask;

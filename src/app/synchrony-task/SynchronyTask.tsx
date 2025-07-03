"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback, useRef } from "react";
import MessagePopup from "components/common/MessagePopup";
import { timer } from "@utils/timer";
import { useSurveyContext } from "state/provider/SurveytProvider";
import useWindowSize from "@hooks/useWindowSize";
import DrumSVG from "app/synchrony-task/DrumSVG";
import CloseGesture from "components/CloseGesture";
import { useSynchronyStateContext } from "state/provider/SynchronyStateProvider";
import DrumPatch from "./DrumPatch";
import { SynchronyContent as TaskContent } from "@constants/tasks.constant";
import { BASE_URL } from "@constants/config.constant";
import { SURVEY_MAX_ATTEMPTS } from "@constants/survey.config.constant";
import { PAGE_ROUTES } from "@constants/route.constant";

const SynchronyTask = ({ isSurvey = false }) => {
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [isGameAtive, setIsGameActive] = useState<boolean>(false);
  const [alertShown, setAlertShown] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [timerData, setTimerData] = useState<{
    startTime: string;
    endTime: string;
    timeLimit: number;
    isTimeOver: boolean;
  } | null>(null);
  const [surveyData, setSurveyData] = useState<any>({});
  const { stickClick, drumHit } = useSynchronyStateContext();
  const { windowSize, deviceType } = useWindowSize();
  const { state, dispatch } = useSurveyContext();
  const searchParams = useSearchParams();
  const stopTimerFuncRef = useRef<() => any>();
  const [showPopupActionButton, setPopupActionButton] =
    useState<boolean>(false);
  // Get the current attempt directly from state
  const noOfAttemptFromState =
    parseInt(state[TaskContent.id]?.noOfAttempt) || 0;
  const currentAttempt = noOfAttemptFromState + 1;
  const router = useRouter();
  const timeLimit = 30000;

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

  const handleStartGame = () => {
    setStartTime(Date.now());
    setIsGameActive(true);
    handleTimer();
  };

  const handleTimer = () => {
    const { endTimePromise, stopTimer } = timer(timeLimit);

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
        // Navigate to survey page if attempts exceed maximum
        if (currentAttempt > SURVEY_MAX_ATTEMPTS) {
          alert(
            `Max attempts (${SURVEY_MAX_ATTEMPTS}) exceeded, navigating to survey page`
          );
          router.push(PAGE_ROUTES.SURVEY.path);
          return;
        }
        setPopupActionButton(currentAttempt < SURVEY_MAX_ATTEMPTS);
        setIsGameActive(false);
        setShowPopup(true);

        setSurveyData((prevState: any) => {
          const updatedSurveyData = {
            ...prevState,
            timeTaken: timeData.timeTaken,
            timrLimit: timeData?.timeLimit || "",
            endTime: timeData?.endTime || "",
            startTime: timeData?.startTime || "",
            closedWithTimeout: timeData?.isTimeOver || false,
            screenHeight: windowSize.height,
            screenWidth: windowSize.width,
            drumPress: drumHit,
            stickHit: stickClick,
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
    [isSurvey, timerData, currentAttempt, stickClick, drumHit]
  );

  const handleCloseMidWay = () => {
    const timeData = handleStopTimer();
    closeGame(timeData, true);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {isSurvey && <CloseGesture handlePressAction={handleCloseMidWay} />}
      <div className="relative w-full h-full flex flex-col justify-center items-center gap-4">
        <div className="absolute top-24">
          <DrumSVG
            startTime={startTime}
            isSurvey={isSurvey}
            isGameActive={isGameAtive}
          />
        </div>
        <div className="w-full px-12 absolute bottom-0 pt-20">
          <DrumPatch
            startTime={startTime}
            isSurvey={isSurvey}
            isGameActive={isGameAtive}
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

export default SynchronyTask;

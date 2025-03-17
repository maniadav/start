"use client";
import { useSearchParams } from "next/navigation";
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
  const attemptString = searchParams.get("attempt") || "0";
  const attempt = parseInt(attemptString);
  const reAttemptUrl =
    attempt < 3 ? `/${TaskContent.surveyRoute}?attempt=${attempt + 1}` : null;
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
            attempt,
            task: TaskContent.id,
            data: updatedSurveyData,
          });

          return updatedSurveyData;
        });
      }
    },
    [isSurvey, timerData, attempt, stickClick, drumHit]
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
          reAttemptUrl={reAttemptUrl}
        />
      )}
    </div>
  );
};

export default SynchronyTask;

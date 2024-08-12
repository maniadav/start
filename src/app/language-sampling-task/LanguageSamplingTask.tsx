"use client";
import { useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import MessagePopup from "components/common/MessagePopup";
import { timer } from "@utils/timer";
import { useSurveyContext } from "context/SurveyContext";
import useWindowSize from "@hooks/useWindowSize";
import AudioRecorder from "@hooks/useAudioRecorder";

const LanguageSamplingTask = ({ isSurvey = false }) => {
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
    attempt < 3 ? `bubble-popping-task?attempt=${attempt + 1}` : null;
  const timeLimit = 180000;

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
    (timeData?: any) => {
      if (isSurvey) {
        setShowPopup(true);
        console.log({ timeData });
        setSurveyData((prevState: any) => {
          const updatedSurveyData = {
            ...prevState,
            timeTaken: timeData?.timeLimit || "",
            endTime: timeData?.endTime || "",
            startTime: timeData?.startTime || "",
            closedWithTimeout: timeData?.isTimeOver || false,
            screenHeight: windowSize.height,
            screenWidth: windowSize.width,
            deviceType,
          };

          dispatch({
            type: "UPDATE_SURVEY_DATA",
            attempt,
            task: "LanguageSamplingTask",
            data: updatedSurveyData,
          });

          return updatedSurveyData;
        });
      }
    },
    [isSurvey, timerData, attempt]
  );

  const handleCloseGame = () => {
    if (isSurvey) {
      const timeData = handleStopTimer();
      closeGame(timeData);
    } else {
      alert("you may start the game!");
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <div className="relative h-screen w-full">
        <Image
          src="/image/langaugesampling.png"
          layout="fill"
          objectFit="contain"
          alt="langaugesampling.png"
          className="h-screen w-auto"
        />{" "}
      </div>

      {isSurvey && <AudioRecorder closeGame={handleCloseGame} />}
      {/*       
      <div className="absolute bottom-1 left-1/2">
        <button
          className="border border-black shadow-lg rounded-full bg-primary w-16 h-16 px-2 py-1 "
          onClick={handleCloseGame}
        ></button>
      </div> */}
      {isSurvey && (
        <MessagePopup
          showFilter={showPopup}
          msg={
            "You have completed the Language Sampling Task. You can now make another attempt for this test, go back to the survey dashboard or start the new task. "
          }
          testName={"language Sampling task"}
          reAttemptUrl={reAttemptUrl}
        />
      )}
    </div>
  );
};

export default LanguageSamplingTask;

"use client";
import { useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import MessagePopup from "components/common/MessagePopup";
import { timer } from "@utils/timer";
import { useSurveyContext } from "state/provider/SurveytProvider";
import useWindowSize from "@hooks/useWindowSize";
import AudioRecorder from "@hooks/useAudioRecorder";
import CommonIcon from "components/common/CommonIcon";
import CloseGesture from "components/CloseGesture";
import { LanguageSamplingContent as TaskContent } from "@constants/tasks.constant";
import { BASE_URL } from "@constants/config.constant";

const LanguageSamplingTask = ({ isSurvey = false }) => {
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [alertShown, setAlertShown] = useState(false);
  const [audioString, setAudioString] = useState();
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
    attempt < 3 ? `${TaskContent.surveyRoute}?attempt=${attempt + 1}` : null;
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
    (timeData?: any, audioBlob?: any, closedMidWay: boolean = false) => {
      if (isSurvey) {
        setShowPopup(true);
        console.log({ timeData });
        setSurveyData((prevState: any) => {
          const updatedSurveyData = {
            ...prevState,
            timeTaken: timeData?.timeTaken || "",
            timeLimit: timeData?.timeLimit || "",
            endTime: timeData?.endTime || "",
            startTime: timeData?.startTime || "",
            closedWithTimeout: timeData?.isTimeOver || false,
            screenHeight: windowSize.height,
            screenWidth: windowSize.width,
            audio: audioBlob || "",
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
    [isSurvey, timerData, attempt, audioString]
  );

  const handleCloseGame = (data: string) => {
    console.log(data);
    if (isSurvey) {
      const timeData = handleStopTimer();
      closeGame(timeData, data);
    } else {
      alert("you may start the game!");
    }
  };
  const handleCloseMidWay = () => {
    const timeData = handleStopTimer();
    closeGame(timeData, "", true);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {isSurvey && <CloseGesture handlePressAction={handleCloseMidWay} />}
      <div className="relative h-screen w-full">
        <Image
          src={`${BASE_URL}/image/langaugesampling.png`}
          layout="fill"
          objectFit="contain"
          alt="langaugesampling.png"
          className="h-screen w-auto"
        />
      </div>

      {isSurvey && (
        <div className="fixed bottom-12 right-1/2">
          <AudioRecorder handleCloseGame={handleCloseGame} />
        </div>
      )}

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

export default LanguageSamplingTask;

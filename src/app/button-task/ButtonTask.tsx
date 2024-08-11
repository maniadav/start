"use client";
import { useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback, useRef } from "react";
import { ButtonCanvas } from "./ButtonCanvas";
import MessagePopup from "components/common/MessagePopup";
import { timer } from "@utils/timer";
import { useSurveyContext } from "context/SurveyContext";
import useWindowSize from "@hooks/useWindowSize";

const ButtonTask = ({ isSurvey = false }) => {
  const [buttonClicked, setButtonClicked] = useState<string[]>([]);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [alertShown, setAlertShown] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [videoSRC, setVideoSRC] = useState<string>();
  const [timerData, setTimerData] = useState<{
    startTime: string;
    endTime: string;
    timeLimit: number;
    isTimeOver: boolean;
  } | null>(null);
  const [surveyData, setSurveyData] = useState<any>({
    closedWithTimeout: false,
    timeTaken: "",
    startTime: "",
    endTime: "",
    screenHeight: "",
    screenWidth: "",
    deviceType: "",
  });

  const { windowSize, deviceType } = useWindowSize();
  const { dispatch } = useSurveyContext();
  const searchParams = useSearchParams();
  const attemptString = searchParams.get("attempt") || "1";
  const attempt = parseInt(attemptString);
  const reAttemptUrl =
    attempt < 3 ? `button-task?attempt=${attempt + 1}` : null;
  const timeLimit = 180000; // 3 minutes
  const stopTimerFuncRef = useRef<() => any>();

  useEffect(() => {
    if (isSurvey) {
      setButtonClicked([]);
      handleStartGame();
    }
  }, [isSurvey]);

  useEffect(() => {
    if (buttonClicked.length >= 8) {
      if (isSurvey) {
        const timer = setTimeout(() => {
          const timeData = handleStopTimer();
          closeGame(timeData);
        }, 3000);
        return () => clearTimeout(timer);
      }
    }
  }, [buttonClicked]);

  useEffect(() => {
    if (timerData?.isTimeOver && !alertShown) {
      closeGame();
      setAlertShown(true);
    }
  }, [alertShown, timerData]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowVideo(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, [showVideo]);

  const handleStopTimer = useCallback(() => {
    if (stopTimerFuncRef.current) {
      return stopTimerFuncRef.current();
    }
  }, []);

  const handleButtonClick = (color: string) => {
    if (isSurvey) {
      setButtonClicked((prev: string[]) => [...prev, color]);
    }
    setVideoSRC(color === "red" ? "./video/girl.mp4" : "./video/pattern.mp4");
    setShowVideo(true);
  };

  const handleStartGame = useCallback(() => {
    const { endTimePromise, stopTimer } = timer(timeLimit);
    stopTimerFuncRef.current = stopTimer;
    endTimePromise.then(setTimerData);
  }, [timeLimit]);

  const closeGame = useCallback(
    (timeData?: any) => {
      if (isSurvey) {
        setShowPopup(true);
        setSurveyData((prevState: any) => {
          const updatedSurveyData = {
            ...prevState,
            timeTaken: timeData?.timeLimit || "",
            endTime: timeData?.endTime || "",
            startTime: timeData?.startTime || "",
            closedWithTimeout: timeData?.isTimeOver || false,
            buttonClickedData: buttonClicked,
            screenHeight: windowSize.height,
            screenWidth: windowSize.width,
            deviceType: deviceType,
          };

          dispatch({
            type: "UPDATE_SURVEY_DATA",
            attempt,
            task: "ButtonTask",
            data: updatedSurveyData,
          });

          return updatedSurveyData;
        });
      }
    },
    [
      buttonClicked,
      isSurvey,
      timerData,
      attempt,
      windowSize,
      deviceType,
      dispatch,
    ]
  );

  return (
    <div className="w-screen h-screen bg-slate-100 m-0">
      {showVideo ? (
        <div className="w-screen h-screen relative">
          <video
            className="absolute top-0 left-0 w-full h-full object-cover"
            autoPlay
            muted
          >
            <source src={`${videoSRC}`} type="video/mp4" />
          </video>
        </div>
      ) : (
        <ButtonCanvas handleButtonClick={handleButtonClick} />
      )}

      {isSurvey && (
        <MessagePopup
          showFilter={showPopup}
          msg="You have completed the Button Task. Do you want to go back, make a new attempt, or start the next test?"
          testName="Button popping"
          reAttemptUrl={reAttemptUrl}
        />
      )}
    </div>
  );
};

export default ButtonTask;

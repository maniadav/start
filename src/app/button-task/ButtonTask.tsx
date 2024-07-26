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
  const [bubblesPopped, setBubblesPopped] = useState<number>(0);
  const [alertShown, setAlertShown] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [videoSRC, setVideoSRC] = useState<string>();
  const [timerData, setTimerData] = useState<{
    startTime: number;
    endTime: number;
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
  const timeLimit = 1800000;

  useEffect(() => {
    if (isSurvey) {
      setButtonClicked([]);
      handleStartGame();
    }
  }, [isSurvey]);

  useEffect(() => {
    if (buttonClicked.length >= 3) {
      if (isSurvey) {
        const timer = setTimeout(() => {
          const timeData = handleStopTimer();
          closeGame(timeData);
        }, 3000);

        return () => clearTimeout(timer);
      } else {
        alert("you may start the game!");
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
      const data = stopTimerFuncRef.current();
      return data;
    }
  }, []);

  const handleButtonClick = (color: string) => {
    if (isSurvey) {
      setButtonClicked((prev: string[]) => [...prev, color]);
    }
    color === "red"
      ? setVideoSRC("./video/girl.mp4")
      : setVideoSRC("./video/pattern.mp4");
    setShowVideo(true);
  };

  const handleStartGame = () => {
    handleTimer();
  };

  const stopTimerFuncRef = useRef<() => any>();

  const handleTimer = () => {
    const { endTimePromise, stopTimer } = timer(timeLimit);
    stopTimerFuncRef.current = stopTimer;
    endTimePromise.then(setTimerData);
    return () => {
      stopTimerFuncRef.current && stopTimerFuncRef.current();
    };
  };

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
    [buttonClicked, isSurvey, timerData, attempt, bubblesPopped]
  );

  return (
    <div className="w-screen h-screen">
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
          msg={
            "You have completed the Bubble Popping Task. You can now make another attempt for this test, go back to the survey dashboard or start the new task. "
          }
          testName={"bubble popping"}
          reAttemptUrl={reAttemptUrl}
        />
      )}
    </div>
  );
};

export default ButtonTask;

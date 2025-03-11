"use client";
import { useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback, useRef } from "react";
import { ButtonCanvas } from "./ButtonCanvas";
import MessagePopup from "components/common/MessagePopup";
import { timer } from "@utils/timer";
import { useSurveyContext } from "state/provider/SurveytProvider";
import useWindowSize from "@hooks/useWindowSize";
import { getRandomVideo } from "./RandomVideo";
import CloseGesture from "components/CloseGesture";
import { ButtonContent as TaskContent } from "@constants/tasks.constant";

const ButtonTask = ({ isSurvey = false }) => {
  const [buttonClicked, setButtonClicked] = useState<string[]>([]);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [alertShown, setAlertShown] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [videoSRC, setVideoSRC] = useState<string>();
  const [randomVideoObj, setRandomVideoObj] = useState<any>(getRandomVideo());

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
  console.log({ randomVideoObj });
  const attemptString = searchParams.get("attempt") || "1";
  const attempt = parseInt(attemptString);
  const reAttemptUrl =
    attempt < 3 ? `${TaskContent.surveyRoute}?attempt=${attempt + 1}` : null;
  const timeLimit = 180000; // 3 minutes
  const stopTimerFuncRef = useRef<() => any>();

  useEffect(() => {
    if (isSurvey) {
      setButtonClicked([]);
      handleStartGame();
    }
  }, [isSurvey]);

  useEffect(() => {
    // total 8 click allowed
    if (buttonClicked.length > 8) {
      if (isSurvey) {
        const timer = setTimeout(() => {
          const timeData = handleStopTimer();
          closeGame(timeData);
        }, 3000); // delay to allow last video play
        return () => clearTimeout(timer);
      }
    }
  }, [buttonClicked]);

  useEffect(() => {
    if (timerData?.isTimeOver && !alertShown) {
      closeGame(timerData);
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
    setVideoSRC(
      color === "red" ? randomVideoObj.red.video : randomVideoObj.blue.video
    );
    setShowVideo(true);
  };

  const handleStartGame = useCallback(() => {
    const { endTimePromise, stopTimer } = timer(timeLimit);
    stopTimerFuncRef.current = stopTimer;
    endTimePromise.then(setTimerData);
  }, [timeLimit]);

  const closeGame = useCallback(
    (timeData?: any, closedMidWay: boolean = false) => {
      if (isSurvey) {
        setShowPopup(true);
        setSurveyData((prevState: any) => {
          const updatedSurveyData = {
            ...prevState,
            timeTaken: timeData?.timeTaken || "",
            timeLimit: timeData?.timeLimit || "",
            endTime: timeData?.endTime || "",
            startTime: timeData?.startTime || "",
            closedWithTimeout: timeData?.isTimeOver || false,
            buttonClickedData: buttonClicked,
            screenHeight: windowSize.height,
            screenWidth: windowSize.width,
            deviceType: deviceType,
            redButton: randomVideoObj.red.key,
            blueButton: randomVideoObj.blue.key,
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
    [buttonClicked, isSurvey, attempt, windowSize, deviceType, dispatch]
  );

  const handleCloseMidWay = () => {
    const timeData = handleStopTimer();
    closeGame(timeData, true);
  };

  return (
    <div className="w-screen h-screen bg-slate-100 m-0">
      {isSurvey && <CloseGesture handlePressAction={handleCloseMidWay} />}
      {showVideo ? (
        <div className="w-screen h-screen relative cursor-pointer">
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
          msg={TaskContent.taskEndMessage}
          testName={TaskContent.title}
          reAttemptUrl={reAttemptUrl}
        />
      )}
    </div>
  );
};

export default ButtonTask;

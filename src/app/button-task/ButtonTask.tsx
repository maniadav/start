"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback, useRef } from "react";
import { ButtonCanvas } from "./ButtonCanvas";
import MessagePopup from "components/common/MessagePopup";
import { timer } from "@utils/timer";
import { useSurveyContext } from "state/provider/SurveytProvider";
import useWindowSize from "@hooks/useWindowSize";
import { getRandomVideo } from "./RandomVideo";
import CloseGesture from "components/CloseGesture";
import { ButtonContent as TaskContent } from "@constants/tasks.constant";
import { BASE_URL } from "@constants/config.constant";
import { SURVEY_MAX_ATTEMPTS, SURVEY_MAX_DURATION } from "@constants/survey.config.constant";
import { PAGE_ROUTES } from "@constants/route.constant";

const ButtonTask = ({ isSurvey = false }) => {
  const [buttonClicked, setButtonClicked] = useState<string[]>([]);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [alertShown, setAlertShown] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [videoSRC, setVideoSRC] = useState<string>();
  const [randomVideoObj, setRandomVideoObj] = useState<any>(getRandomVideo());
  const [showPopupActionButton, setPopupActionButton] =
    useState<boolean>(false);
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
  const { state, dispatch } = useSurveyContext();
  const searchParams = useSearchParams();
  console.log({ randomVideoObj });
  const attemptString = searchParams.get("attempt") || "1";
  const attempt = parseInt(attemptString);

  const noOfAttemptFromState =
    parseInt(state[TaskContent.id]?.noOfAttempt) || 0;
  const currentAttempt = noOfAttemptFromState + 1;
  const router = useRouter();
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
    const { endTimePromise, stopTimer } = timer(SURVEY_MAX_DURATION);
    stopTimerFuncRef.current = stopTimer;
    endTimePromise.then(setTimerData);
  }, [SURVEY_MAX_DURATION]);

  const closeGame = useCallback(
    (timeData?: any, closedMidWay: boolean = false) => {
      if (isSurvey) {
        if (currentAttempt > SURVEY_MAX_ATTEMPTS) {
          alert(
            `Max attempts (${SURVEY_MAX_ATTEMPTS}) exceeded, navigating to survey page`
          );
          router.push(PAGE_ROUTES.SURVEY.path);
          return;
        }
        setPopupActionButton(currentAttempt < SURVEY_MAX_ATTEMPTS);
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
            attempt: currentAttempt,
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
          showAction={showPopupActionButton}
        />
      )}
    </div>
  );
};

export default ButtonTask;

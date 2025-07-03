"use client";
import { useRouter, useSearchParams } from "next/navigation";
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
import { useAuth } from "state/provider/AuthProvider";
import {
  SURVEY_MAX_ATTEMPTS,
  SURVEY_MAX_DURATION,
} from "@constants/survey.config.constant";
import { PAGE_ROUTES } from "@constants/route.constant";

const LanguageSamplingTask = ({ isSurvey = false }) => {
  // State declarations
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
  const [showPopupActionButton, setPopupActionButton] =
    useState<boolean>(false);
  const { windowSize, deviceType } = useWindowSize();
  const { state, dispatch } = useSurveyContext();
  const searchParams = useSearchParams();
  const attemptString = searchParams.get("attempt") || "0";
  const attempt = parseInt(attemptString);
  const { user } = useAuth();
  const noOfAttemptFromState =
    parseInt(state[TaskContent.id]?.noOfAttempt) || 0;
  const currentAttempt = noOfAttemptFromState + 1;
  const router = useRouter();
  const stopTimerFuncRef = useRef<() => any>();

  // Effects
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

  // Handlers
  const handleStartGame = () => {
    handleTimer();
  };

  const handleTimer = () => {
    const { endTimePromise, stopTimer } = timer(SURVEY_MAX_DURATION);
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
    (timeData?: any, audioBlob?: any, closedMidWay: boolean = false) => {
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
            screenHeight: windowSize.height,
            screenWidth: windowSize.width,
            audio: audioBlob || "",
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
      }
    },
    [
      isSurvey,
      attempt,
      audioString,
      windowSize,
      deviceType,
      dispatch,
      currentAttempt,
      router,
    ]
  );

  const handleCloseGame = (data: string) => {
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
        <div className="fixed bottom-12 right-1/2 translate-x-1/2">
          <AudioRecorder
            handleCloseGame={handleCloseGame}
            child_id_3456_observer_id_k88888_SynchronyTask_2025-06-09
            filename={`child_${user.childID}_observer_${user.observerID}_${TaskContent.id}_${attempt}_audio`}
            attempt={attempt}
          />
        </div>
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

export default LanguageSamplingTask;

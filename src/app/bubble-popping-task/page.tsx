"use client";
import { useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback, useRef } from "react";
import Bubble from "./Bubble";
import Image from "next/image";
import { TasksConstant } from "constants/tasks.constant";
import useAudio from "@hooks/useAudio";
import MessagePopup from "components/common/MessagePopup";
import TaskHome from "components/TaskHome";
import SuspenseWrapper from "components/SuspenseWrapper"; // Import the wrapper component
import { DowloadFile } from "@helper/downloader";
import { setLocalStorageValue } from "@utils/localStorage";
import { BubblePoppingData } from "@constants/survey.data.constant";
import { Attempt, BubblePoppingType } from "types/survey.types";
import { timer } from "@utils/timer";
import { useSurveyContext } from "context/SurveyContext";

const colors: string[] = ["red", "green", "blue", "yellow", "purple", "orange"];
const IndexPage = () => {
  const [survey, setSurvey] = useState<boolean>(false);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [numberOfBubbles, setNumberOfBubbles] = useState<number>(5);
  const [bubbles, setBubbles] = useState<string[]>(colors);
  const [bubblesPopped, setBubblesPopped] = useState<number>(0);
  const { state, dispatch } = useSurveyContext();
  const [alertShown, setAlertShown] = useState(false);
  const [timerData, setTimerData] = useState<{
    startTime: number;
    endTime: number;
    timeLimit: number;
    isTimeOver: boolean;
  } | null>(null);
  // const [surveyData, setSurveyData] =
  //   useState<BubblePoppingType>(BubblePoppingData);
  const [surveyData, setSurveyData] = useState<Attempt>({
    closedWithTimeout: false,
    timeTaken: "",
    ballCoord: [],
    mouseCoord: [],
    colors: [],
    bubblesPopped: "",
    bubblesTotal: "",
    startTime: "",
    endTime: "",
    screenHeight: "",
    screenWidth: "",
    deviceType: "",
  });

  const maxNumberOfBubble: number = 6;
  const searchParams = useSearchParams();
  const attemptString = searchParams.get("attempt") || "0";
  const attempt = parseInt(attemptString);
  const bubblePop = useAudio("/bubble-pop.mp3");
  const data = TasksConstant.BubblePoppingTask;
  const reAttemptUrl =
    attempt < 3 ? `bubble-popping-task?attempt=${attempt + 1}` : null;
  const timeLimit = 1800000;

  // increase bubble number
  useEffect(() => {
    if (numberOfBubbles === maxNumberOfBubble + 1) {
      handleStopTimer();
      closeGame();
    } else {
      setBubbles(colors.slice(0, numberOfBubbles));
    }
  }, [numberOfBubbles]);

  useEffect(() => {
    if (timerData?.isTimeOver && !alertShown) {
      closeGame();
      setAlertShown(true);
    }
  }, [alertShown, timerData]);

  // function to get the coordinates of click
  const pushEntry = (ballCoordEntry: any, mouseCoordEntry: any, color: any) => {
    setSurveyData((prevState: any) => ({
      ...prevState,
      ballCoord: [...(prevState?.ballCoord || []), ballCoordEntry],
      mouseCoord: [...(prevState?.mouseCoord || []), mouseCoordEntry],
      colors: [...(prevState?.colors || []), color],
    }));
  };

  const handleBubblePop = (
    ball_coord: any,
    mouse_coord: any,
    color: string
  ) => {
    bubblePop();
    setBubblesPopped((prevState) => prevState + 1);
    pushEntry(ball_coord, mouse_coord, color);

    setBubbles((bubble) =>
      bubble.filter((prevBubbles) => prevBubbles !== color)
    );
    if (bubbles.length - 1 === 0) {
      setNumberOfBubbles((numberOfBubbles) => numberOfBubbles + 1);
    }
  };

  const handleStartGame = () => {
    handleTimer();

    setSurvey(!survey);
    const width = window.screen.width;
    const height = window.screen.height;
    const device = navigator.userAgent;

    setSurveyData((prevState: any) => ({
      ...prevState,
      screenHeight: height,
      screenWidth: width,
      deviceType: device,
    }));
    setNumberOfBubbles(1);
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
      setTimerData(data);
    }
  }, []);

  const closeGame = useCallback(() => {
    if (survey) {
      setShowPopup(true);
      console.log({ timerData });
      const bubblesTotal: number =
        (maxNumberOfBubble / 2) * (2 + (maxNumberOfBubble - 1));
      setSurveyData((prevState: any) => {
        const updatedSurveyData = {
          ...prevState,
          timeTaken: timerData?.timeLimit || "",
          endTime: timerData?.endTime || "",
          startTime: timerData?.startTime || "",
          closedWithTimeout: timerData?.isTimeOver || false,
          bubblesTotal,
          bubblesPopped,
        };

        dispatch({
          type: "UPDATE_SURVEY_DATA",
          attempt,
          task: "BubblePoppingTask",
          data: updatedSurveyData,
        });

        return updatedSurveyData;
      });
    }
  }, [survey, timerData, attempt, bubblesPopped]);

  // const handleDownload = () => {
  //   DowloadFile(surveyData, "sample-data.json");
  // };

  // console.log({ timerData });
  return (
    <>
      {survey ? (
        <div>
          <div className="relative w-screen h-screen overflow-hidden">
            <Image
              src="/ocean.jpg"
              layout="fill"
              objectFit="cover"
              alt="ocean"
            />
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
              <div className="flex flex-wrap justify-center">
                {bubbles.map((color: string) => (
                  <Bubble
                    key={color}
                    color={color}
                    onClick={handleBubblePop}
                    bubbleSize={100}
                  />
                ))}
              </div>
            </div>
          </div>
          <MessagePopup
            showFilter={showPopup}
            msg={
              "You have completed the Bubble Popping Task. You can now make another attempt for this test, go back to the survey dashboard or start the new task. "
            }
            testName={"bubble popping"}
            reAttemptUrl={reAttemptUrl}
          />
        </div>
      ) : (
        <div className="w-full h-full overflow-hidden">
          <TaskHome
            taskName={data.title}
            taskMessage={data.taskMessage}
            handleStartGame={() => handleStartGame()}
          />
          <div className="relative w-screen h-screen overflow-hidden">
            <Image
              src="/ocean.jpg"
              layout="fill"
              objectFit="cover"
              alt="ocean"
            />
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
              <div className="flex flex-wrap justify-center">
                {bubbles.map((color: string) => (
                  <Bubble
                    key={color}
                    color={color}
                    onClick={handleBubblePop}
                    bubbleSize={100}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      <audio id="bubble-pop" src="bubble-pop.mp3" preload="auto"></audio>
    </>
  );
};
export default function Page() {
  return (
    <SuspenseWrapper>
      <IndexPage />
    </SuspenseWrapper>
  );
}

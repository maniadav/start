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
import { BubblePoppingType } from "types/survey.types";
import { timer } from "@utils/timer";

const colors: string[] = ["red", "green", "blue", "yellow", "purple", "orange"];
const IndexPage = () => {
  const [survey, setSurvey] = useState<boolean>(false);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [numberOfBubbles, setNumberOfBubbles] = useState<number>(5);
  const [bubbles, setBubbles] = useState<string[]>(colors);

  const [alertShown, setAlertShown] = useState(false);
  const [timerData, setTimerData] = useState<{
    startTime: number;
    endTime: number;
    timeLimit: number;
    isTimeOver: boolean;
  } | null>(null);
  const [surveyData, setSurveyData] =
    useState<BubblePoppingType>(BubblePoppingData);

  const maxNumberOfBubble: number = 3;
  const searchParams = useSearchParams();
  const attempt = searchParams.get("attempt") || "0";
  const bubblePop = useAudio("/bubble-pop.mp3");
  const data = TasksConstant.bubblePoppingTask;
  const reAttemptUrl =
    parseInt(attempt) < 3
      ? `bubble-popping-task?attempt=${parseInt(attempt) + 1}`
      : null;
  const timeLimit = 18000;

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
      [`attempt${attempt}`]: {
        ...prevState[`attempt${attempt}`],
        ballCoord: [
          ...(prevState[`attempt${attempt}`]?.ballCoord || []),
          ballCoordEntry,
        ],
        mouseCoord: [
          ...(prevState[`attempt${attempt}`]?.mouseCoord || []),
          mouseCoordEntry,
        ],
        colors: [...(prevState[`attempt${attempt}`]?.colors || []), color],
      },
      noOfAttempt: `${attempt}`,
    }));
  };

  const handleBubblePop = (
    ball_coord: any,
    mouse_coord: any,
    color: string
  ) => {
    bubblePop();

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
      [`attempt${attempt}`]: {
        ...prevState[`attempt${attempt}`],
        screenHeight: height,
        screenWidth: width,
        deviceType: device,
      },
      noOfAttempt: `${attempt}`,
    }));
    setNumberOfBubbles(1);
  };

  const closeGame = useCallback(() => {
    if (survey) {
      setShowPopup(true);
      const bubblesTotal: number =
        (maxNumberOfBubble / 2) * (2 + (maxNumberOfBubble - 1));
      setSurveyData((prevState: any) => {
        const updatedSurveyData = {
          ...prevState,
          [`attempt${attempt}`]: {
            ...prevState[`attempt${attempt}`],
            timeTaken: timerData?.timeLimit,
            endTime: timerData?.endTime,
            startTime: timerData?.startTime,
            closedWithTimeout: timerData?.isTimeOver,
            bubblesTotal,
          },
        };

        // Update local storage with the updated survey data
        setLocalStorageValue("BubblePoppingTask", updatedSurveyData, true);

        return updatedSurveyData;
      });
    }
  }, [survey, timerData, attempt]);

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

  const handleDownload = () => {
    DowloadFile(surveyData, "sample-data.json");
  };

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
              <button onClick={() => handleDownload()} className="text-black">
                Download CSV
              </button>
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
            attempt={attempt}
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

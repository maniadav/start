"use client";
import { useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import Bubble from "./Bubble";
import Image from "next/image";
import { TasksConstant } from "constants/tasks.constant";
import useAudio from "@hooks/useAudio";
import MessagePopup from "components/common/MessagePopup";
import TaskHome from "components/TaskHome";
import { useRouter } from "next/navigation";
import SuspenseWrapper from "components/SuspenseWrapper"; // Import the wrapper component
import { DowloadFile } from "@helper/downloader";
import { setLocalStorageValue } from "@utils/localStorage";
import { BubblePoppingData } from "@constants/survey.data.constant";
import { BubblePoppingType } from "types/survey.types";

const colors: string[] = ["red", "green", "blue", "yellow", "purple", "orange"];
const IndexPage = () => {
  const [survey, setSurvey] = useState<boolean>(false);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [numberOfBubbles, setNumberOfBubbles] = useState<number>(5);
  const [bubbles, setBubbles] = useState<string[]>(colors);
  const [poppedBubbles, setPoppedBubbles] = useState<any>([]);
  const [startTime, setStartTime] = useState<any>(null);
  const [surveyData, setSurveyData] =
    useState<BubblePoppingType>(BubblePoppingData);
  const maxNumberOfBubble: number = 3;
  const searchParams = useSearchParams();
  const router = useRouter();
  const attempt = searchParams.get("attempt") || "0";
  const bubblePop = useAudio("/bubble-pop.mp3");
  const data = TasksConstant.bubblePoppingTask;
  const reAttemptUrl =
    parseInt(attempt) < 3
      ? `bubble-popping-task?attempt=${parseInt(attempt) + 1}`
      : null;

  // increase bubble number
  useEffect(() => {
    if (numberOfBubbles === maxNumberOfBubble + 1) {
      closeGame();
    } else {
      setBubbles(colors.slice(0, numberOfBubbles));
    }
  }, [numberOfBubbles]);

  // function to get the coordinates of click
  const pushEntry = (ballCoordEntry: any, mouseCoordEntry: any, color: any) => {
    console.log(ballCoordEntry, mouseCoordEntry);
    setSurveyData((prevState: any) => ({
      ...prevState,
      [`attempt${attempt}`]: {
        ...prevState[`attempt${attempt}`],
        ballCoord: [...prevState.attempt1.ballCoord, ballCoordEntry],
        mouseCoord: [...prevState.attempt1.mouseCoord, mouseCoordEntry],
        colors: [...prevState.attempt1.colors, color],
      },
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
    startTimer();
    setSurvey(!survey);
    const currentTime = Date.now();
    const width = window.screen.width;
    const height = window.screen.height;
    const device = navigator.userAgent;

    setStartTime(currentTime);
    setSurveyData((prevState: any) => ({
      ...prevState,
      [`attempt${attempt}`]: {
        ...prevState[`attempt${attempt}`],
        startTime: currentTime,
        screenHeight: height,
        screenWidth: width,
        deviceType: device,
      },
    }));
    setNumberOfBubbles(1);
  };

  const closeGame = useCallback(() => {
    if (survey) {
      console.log({ surveyData });

      setShowPopup(true);
      const endTime = Date.now();
      const timeTaken = ((endTime - startTime) / 1000).toFixed(2);
      // setSurveyData((prevState: any) => ({
      //   ...prevState,
      //   [`attempt${attempt}`]: {
      //     ...prevState[`attempt${attempt}`],
      //     timeTaken: timeTaken,
      //   },
      // }));

      // setLocalStorageValue("BubblePoppingTask", surveyData, true);
      setSurveyData((prevState: any) => {
        const updatedSurveyData = {
          ...prevState,
          [`attempt${attempt}`]: {
            ...prevState[`attempt${attempt}`],
            timeTaken: timeTaken,
            endTime: endTime,
          },
        };

        // Update local storage with the updated survey data
        setLocalStorageValue("BubblePoppingTask", updatedSurveyData, true);

        return updatedSurveyData;
      });
    }
  }, [survey, startTime]);

  // timer of 3 min
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [alertShown, setAlertShown] = useState(false);

  useEffect(() => {
    let interval: string | number | NodeJS.Timeout | undefined;

    if (isRunning) {
      interval = setInterval(() => {
        setElapsedTime((prevTime) => prevTime + 1);
      }, 1000); // Update elapsedTime every second
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRunning]);

  useEffect(() => {
    if (elapsedTime >= 180 && !alertShown) {
      closeGame();
      setAlertShown(true);
    }
  }, [elapsedTime, alertShown, closeGame]);

  const startTimer = () => {
    setIsRunning(true);
  };

  const handleDownload = () => {
    DowloadFile(surveyData, "sample-data.json");
  };

  console.log({ surveyData });

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

            <p className="absolute bottom-5 right-5">
              Time elapsed:{" "}
              {startTime
                ? `${((Date.now() - startTime) / 1000).toFixed(2)} seconds`
                : "Not started"}
            </p>
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

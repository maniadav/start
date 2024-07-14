"use client";
import { useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";

import Image from "next/image";
import { TasksConstant } from "constants/tasks.constant";
import useAudio from "@hooks/useAudio";
import MessagePopup from "components/common/MessagePopup";
import TaskHome from "components/TaskHome";
import { useRouter } from "next/navigation";
import SuspenseWrapper from "components/SuspenseWrapper"; // Import the wrapper component
import MototFollowingTask from "./MototFollowingTask";

const colors: string[] = ["red", "green", "blue", "yellow", "purple", "orange"];
const IndexPage = () => {
  const [survey, setSurvey] = useState<boolean>(false);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [numberOfBubbles, setNumberOfBubbles] = useState<number>(5);
  const [bubbles, setBubbles] = useState<string[]>(colors);
  const [poppedBubbles, setPoppedBubbles] = useState<any>([]);
  const [startTime, setStartTime] = useState<any>(null);
  const [surveyData, setSurveyData] = useState<any>({
    id: "BubblePoppingTask",
    attempt1: {
      closedWithError: false,
      timeTaken: "",
      ballCoord: [],
      mouseCoord: [],
      colors: [],
    },
    attempt2: {},
    attempt3: {},
  });

  const searchParams = useSearchParams();
  const router = useRouter();
  const attempt = searchParams.get("attempt") || "0";
  const bubblePop = useAudio("/bubble-pop.mp3");
  const data = TasksConstant.MotorFollowingTask;
  const reAttemptUrl =
    parseInt(attempt) < 3
      ? `bubble-popping-task?attempt=${parseInt(attempt) + 1}`
      : null;

  // increase bubble number
  useEffect(() => {
    // max bubbble on screen, 6
    if (numberOfBubbles === 7) {
      closeGame();
    } else {
      setBubbles(colors.slice(0, numberOfBubbles));
    }
  }, [numberOfBubbles]);

  // function to get the coordinates of click

  const pushEntry = (ballCoordEntry: any, mouseCoordEntry: any, color: any) => {
    setSurveyData((prevState: any) => ({
      ...prevState,
      attempt1: {
        ...prevState.attempt1,

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
    setStartTime(Date.now());
    setNumberOfBubbles(1);
  };
  const handleResetGame = () => {
    setBubbles(bubbles.map((bubble: any) => ({ ...bubble, popped: false })));
    setPoppedBubbles([]);
    setStartTime(null);
  };
  const closeGame = useCallback(() => {
    if (survey) {
      setShowPopup(true);
      const timeTaken = ((Date.now() - startTime) / 1000).toFixed(2);
      setSurveyData((prevState: any) => ({
        ...prevState,
        attempt1: {
          ...prevState.attempt1,
          timeTaken: timeTaken,
        },
      }));
    }
  }, [survey, startTime]);

  useEffect(() => {
    if (numberOfBubbles === 7) {
      closeGame();
    } else {
      setBubbles(colors.slice(0, numberOfBubbles));
    }
  }, [numberOfBubbles, closeGame]);

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

  // const handleTimeout = () => {
  //   console.log("3 minutes have passed. Calling the function...");
  //   closeGame();
  // };

  // console.log({ surveyData });

  return (
    <>
      {survey ? (
        <div>
          <MototFollowingTask isSurvey={true} />
        </div>
      ) : (
        <div className="w-full h-full overflow-hidden">
          <TaskHome
            taskName={data.title}
            taskMessage={data.taskMessage}
            handleStartGame={() => handleStartGame()}
          />

          <MototFollowingTask />
        </div>
      )}
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

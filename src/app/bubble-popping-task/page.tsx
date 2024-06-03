"use client";
import { useState, useEffect } from "react";
import Bubble from "./Bubble";
import Image from "next/image";
import { CommonButton } from "components/common/CommonButton";
import { TasksConstant } from "constants/tasks.constant";

import { useSearchParams } from "next/navigation";
import MessagePopup from "components/common/MessagePopup";
import TaskHome from "components/TaskHome";
const colors: string[] = ["red", "green", "blue", "yellow", "purple", "orange"];

const IndexPage = () => {
  const [survey, setSurvey] = useState<boolean>(false);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [numberOfBubbles, setNumberOfBubbles] = useState<number>(5);
  const [bubbles, setBubbles] = useState<string[]>(colors);
  const [poppedBubbles, setPoppedBubbles] = useState<any>([]);
  const [startTime, setStartTime] = useState<any>(null);
  const [timeTaken, setTimeTaken] = useState<any>(null);
  const searchParams = useSearchParams();
  const attempt = searchParams.get("attempt") || "0";
  const bubblePop = new Audio("bubble-pop.mp3");
  const data = TasksConstant.bubblePoppingTask;
  const reAttemptUrl =
    parseInt(attempt) < 3
      ? `bubble-popping-task?attempt=${parseInt(attempt) + 1}`
      : null;

  // increase bubble number
  useEffect(() => {
    // max bubbble on screen, 6
    if (numberOfBubbles === 6) {
      closeGame();
    } else {
      setBubbles(colors.slice(0, numberOfBubbles));
    }
  }, [numberOfBubbles]);

  const popBubble = (color: string) => {
    bubblePop.play();
    setBubbles((bubble) =>
      bubble.filter((prevBubbles) => prevBubbles !== color)
    );
    if (bubbles.length - 1 === 0) {
      setNumberOfBubbles((numberOfBubbles) => numberOfBubbles + 1);
    }
  };

  const handleStartGame = () => {
    setSurvey(!survey);
    setStartTime(Date.now());
    setNumberOfBubbles(1);
  };

  const handleResetGame = () => {
    setBubbles(bubbles.map((bubble: any) => ({ ...bubble, popped: false })));
    setPoppedBubbles([]);
    setStartTime(null);
  };

  const closeGame = () => {
    setShowPopup(true);
    console.log(`${((Date.now() - startTime) / 1000).toFixed(2)} seconds`);
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
              <div className="flex flex-wrap justify-center">
                {bubbles.map((color: string) => (
                  <Bubble
                    key={color}
                    color={color}
                    onClick={() => popBubble(color)}
                    bubbleSize={100}
                  />
                ))}
              </div>
            </div>

            <div className="absolute top-5 right-5">
              <button
                className="rounded bg-gray-800 text-gray-300 px-2 py-1 "
                onClick={handleStartGame}
              >
                Close
              </button>
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
            // onRequestClose={(showPopup: boolean) => setShowPopup(!showPopup)}

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
                    onClick={() => popBubble(color)}
                    bubbleSize={100}
                  />
                ))}
                {/* <BallComponent /> */}
              </div>
            </div>
          </div>
        </div>
      )}
      <audio id="bubble-pop" src="bubble-pop.mp3" preload="auto"></audio>
    </>
  );
};

export default IndexPage;

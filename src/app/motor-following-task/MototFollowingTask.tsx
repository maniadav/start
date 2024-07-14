"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import useDraw from "@hooks/useDraw";
import useWindowSize from "@hooks/useWindowSize";
import { drawLine } from "@utils/canva";
import Ball from "./Ball";
import MessagePopup from "components/common/MessagePopup";
import { useSearchParams } from "next/navigation";
import { useSurveyContext } from "context/SurveyContext";
import { timer } from "@utils/timer";
import { trackTaskTime } from "@utils/trackTime";

interface Coordinate {
  x: number;
  y: number;
}

export default function MotorFollowingTask({ isSurvey = false }) {
  const [surveyData, setSurveyData] = useState<any>(false);
  const [ballCoordinatesX, setBallCoordinatesX] = useState<string[]>([]);
  const [ballCoordinatesY, setBallCoordinatesY] = useState<string[]>([]);
  const [mouseCoordinatesX, setMouseCoordinatesX] = useState<string[]>([]);
  const [mouseCoordinatesY, setMouseCoordinatesY] = useState<string[]>([]);
  const [mouseCoordinates, setMouseCoordinates] = useState<Coordinate[][]>([]);
  const [currentPath, setCurrentPath] = useState<Coordinate[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [alertShown, setAlertShown] = useState(false);
  const [timerData, setTimerData] = useState<{
    startTime: number;
    endTime: number;
    timeLimit: number;
    isTimeOver: boolean;
  } | null>(null);

  const { canvasRef, onInteractStart } = useDraw(onDraw);
  const { state, dispatch } = useSurveyContext();
  const { windowSize } = useWindowSize();
  const searchParams = useSearchParams();

  const balls = useRef<any[]>([]);
  const animationRef = useRef<number | null>(null);

  const color = "#000000";
  const newlineWidth = 3;
  const attemptString = searchParams.get("attempt") || "0";
  const attempt = parseInt(attemptString);
  const amplitudes = 100 + attempt * 50; // change the size of ball path on each attempt
  const reAttemptUrl =
    attempt < 3 ? `motor-following-task?attempt=${attempt + 1}` : null;

  function onDraw({ prevPoint, currentPoint, ctx }: Draw) {
    if (!isDrawing || !currentPoint || !prevPoint) return;

    drawLine({ prevPoint, currentPoint, ctx, color, newlineWidth });

    setCurrentPath((prev) => [...prev, currentPoint]);
  }

  const handleInteractStart = () => {
    setIsDrawing(true);
    setCurrentPath([]);
    onInteractStart();
  };

  const handleInteractEnd = () => {
    setIsDrawing(false);
    setMouseCoordinates((prev) => [...prev, currentPath]);
    const xCoordinates = currentPath.map((coord) => coord.x.toFixed(2));
    const yCoordinates = currentPath.map((coord) => coord.y.toFixed(2));
    setMouseCoordinatesX(xCoordinates);
    setMouseCoordinatesY(yCoordinates);
  };

  const [timeResult, setTimeResult] = useState<{
    timeStart: string | null;
    timeEnd: string | null;
    timeTaken: string | null;
  } | null>(null);

  // const handleStart = () => {
  //   trackTaskTime('start'); // Start tracking time
  // };

  const handleEnd = () => {
    const result = trackTaskTime("end"); // End tracking time and get the result
    // setTimeResult(result); // Store the result in state
  };
  const initializeCanvas = useCallback(
    (canvasElement: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
      canvasElement.width = window.innerWidth;
      canvasElement.height = window.innerHeight;
      canvasElement.style.backgroundImage = 'url("/motor_bg.jpg")';
      canvasElement.style.backgroundSize = "cover";
      canvasElement.style.backgroundPosition = "center";

      if (balls.current.length === 0) {
        const r = 25;
        const x = canvasElement.width;
        const y = canvasElement.height / 2;
        const c = "red";
        balls.current.push(Ball(x, y, r, c, ctx, amplitudes));
      }
    },
    []
  );

  useEffect(() => {
    const canvasElement = canvasRef.current;

    if (canvasElement) {
      const ctx = canvasElement.getContext("2d");
      if (ctx) {
        initializeCanvas(canvasElement, ctx);

        const update = () => {
          ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);

          mouseCoordinates.forEach((path) => {
            path.forEach((point, i) => {
              if (i === 0) return;
              drawLine({
                prevPoint: path[i - 1],
                currentPoint: point,
                ctx,
                color,
                newlineWidth,
              });
            });
          });

          currentPath.forEach((point, i) => {
            if (i === 0) return;
            drawLine({
              prevPoint: currentPath[i - 1],
              currentPoint: point,
              ctx,
              color,
              newlineWidth,
            });
          });

          balls.current.forEach((ball) => {
            ball.animate();
            if (ball.getIsMoving()) {
              const { x, y } = ball.getPosition();
              setBallCoordinatesX((prev) => [...prev, x.toFixed(2)]);
              setBallCoordinatesY((prev) => [...prev, y.toFixed(2)]);
            }

            // setBallCoordinates((prev)=>[...prev, ball.getPosition()])
          });

          animationRef.current = requestAnimationFrame(update);
        };

        update();
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [mouseCoordinates, currentPath, windowSize, initializeCanvas]);

  const saveImage = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      // Plot the ball coordinates as points

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ballCoordinatesX.forEach((x, index) => {
          const y = ballCoordinatesY[index];
          ctx.beginPath();
          ctx.arc(parseFloat(x), parseFloat(y), 2, 0, Math.PI * 2);
          ctx.fillStyle = "blue";
          ctx.fill();
        });
      }
      const link = document.createElement("a");
      link.download = "drawing.png";
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  const handleStartGame = () => {
    // handleTimer();
    trackTaskTime("start"); // Start tracking time
    const width = window.screen.width;
    const height = window.screen.height;
    const device = navigator.userAgent;

    setSurveyData((prevState: any) => ({
      ...prevState,
      screenHeight: height,
      screenWidth: width,
      deviceType: device,
    }));
  };

  const stopTimerFuncRef = useRef<() => any>();

  const handleTimer = () => {
    const { endTimePromise, stopTimer } = timer(180000);

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
      return data;
    }
  }, []);

  const closeGame = useCallback(() => {
    // const timerData = handleStopTimer();
    const timerData = trackTaskTime("end");
    saveImage();
    setShowPopup(true);
    console.log({ timerData });
    setSurveyData((prevState: any) => {
      const updatedSurveyData = {
        ...prevState,
        timeTaken: timerData?.timeTaken || "",
        endTime: timerData?.endTime || "",
        startTime: timerData?.startTime || "",
        closedWithTimeout: false,
        objCoordX: ballCoordinatesX,
        objCoordY: ballCoordinatesX,
        touchCoordX: mouseCoordinatesX,
        touchCoordY: mouseCoordinatesY,
      };

      console.log({ updatedSurveyData });
      // dispatch({
      //   type: "UPDATE_SURVEY_DATA",
      //   attempt,
      //   task: "MotorFollowingTask",
      //   data: updatedSurveyData,
      // });

      return updatedSurveyData;
    });
  }, [
    isSurvey,
    timerData,
    attempt,
    ballCoordinatesX,
    ballCoordinatesY,
    mouseCoordinatesX,
    mouseCoordinatesY,
  ]);

  useEffect(() => {
    if (isSurvey) {
      handleStartGame();
    }
  }, []);

  if (windowSize.height && windowSize.width !== undefined) {
    return (
      <div className="w-screen h-screen overflow-hidden">
        <canvas
          id="canvas"
          width={windowSize.width}
          height={windowSize.height}
          ref={canvasRef}
          onMouseDown={handleInteractStart}
          onMouseUp={handleInteractEnd}
          onTouchStart={handleInteractStart}
          onTouchEnd={handleInteractEnd}
          className="cursor-pointer"
        />
        {isSurvey && (
          <div>
            <div className="fixed top-4 right-4 flex flex-col space-y-2">
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                onClick={closeGame}
              >
                Save
              </button>
            </div>
            <MessagePopup
              showFilter={showPopup}
              msg="You have completed the Bubble Popping Task. You can now make another attempt for this test, go back to the survey dashboard or start the new task."
              testName="bubble popping"
              reAttemptUrl={reAttemptUrl}
            />
          </div>
        )}
      </div>
    );
  }
  return null;
}

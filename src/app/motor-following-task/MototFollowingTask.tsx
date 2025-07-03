"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import useDraw from "@hooks/useDraw";
import useWindowSize from "@hooks/useWindowSize";
import { drawLine } from "@utils/canva";
import { timer } from "@utils/timer";
import MessagePopup from "components/common/MessagePopup";
import { useSearchParams } from "next/navigation";
import { useSurveyContext } from "state/provider/SurveytProvider";
import { trackTaskTime } from "@utils/trackTime";
import Image from "next/image";
import BallAnimation from "./BallAnimation";
import { useMotorStateContext } from "state/provider/MotorStateProvider";
import { Coordinate } from "types/survey.types";
import useAudio from "@hooks/useAudio";
import CloseGesture from "components/CloseGesture";
import { MotorFollowingContent as TaskContent } from "@constants/tasks.constant";
import { BASE_URL } from "@constants/config.constant";
import { useAuth } from "state/provider/AuthProvider";
import { setIndexedDBValue } from "@utils/indexDB";
import { IndexDB_Storage } from "@constants/storage.constant";
import { PAGE_ROUTES } from "@constants/route.constant";
import { SURVEY_MAX_ATTEMPTS } from "@constants/survey.config.constant";

export default function MotorFollowingTask({ isSurvey = false }) {
  const [isArrowVisible, setIsArrowVisible] = useState(true);
  const [surveyData, setSurveyData] = useState<any>(false);

  const [time, setTime] = useState<number[]>([0]);
  const [objX, setObjX] = useState<number[]>([0]);
  const [touchX, setTouchX] = useState<number[]>([0]);
  const [objY, setObjY] = useState<number[]>([0]);
  const [touchY, setTouchY] = useState<number[]>([0]);

  const [touchCoordinates, setTouchCoordinates] = useState<Coordinate[]>([
    { x: 0, y: 0 },
  ]);
  const [mouseCoordinates, setMouseCoordinates] = useState<Coordinate[][]>([]);
  const [currentPath, setCurrentPath] = useState<Coordinate[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [caught, setCaught] = useState<boolean>(false);
  const [alertShown, setAlertShown] = useState(false);
  const [popupAttempt, setPopupAttempt] = useState<number>(1); // Track attempt for popup display
  const [timerData, setTimerData] = useState<{
    startTime: string;
    endTime: string;
    timeLimit: number;
    isTimeOver: boolean;
  } | null>(null);

  const { canvasRef, onInteractStart } = useDraw(onDraw);
  const { state, dispatch } = useSurveyContext();

  useEffect(() => {
    const attempt = parseInt(state.MotorFollowingTask.noOfAttempt) || 0;
    setPopupAttempt(attempt + 1);
  }, [state.MotorFollowingTask.noOfAttempt]);
  const { windowSize, deviceType } = useWindowSize();
  const searchParams = useSearchParams();
  const { ballCoordinates } = useMotorStateContext();
  const bubblePop = useAudio(`${BASE_URL}/audio/audio-caught.wav`);
  const ballCoordinatesRef = useRef(ballCoordinates);
  const touchCoordinatesRef = useRef(touchCoordinates);
  // const balls = useRef<any[]>([]);
  const animationRef = useRef<number | null>(null);
  const color = "#000000";
  const newlineWidth = 3;
  const currentDate = Date.now();
  const stopTimerFuncRef = useRef<() => any>();
  const { user } = useAuth();
  // Generate a unique image file name
  const imagefile = `child_${user.childID}_observer_${user.observerID}_${TaskContent.id}_${popupAttempt}_image`;
  // require for updated movement data
  useEffect(() => {
    ballCoordinatesRef.current = ballCoordinates;
  }, [ballCoordinates]);

  useEffect(() => {
    touchCoordinatesRef.current = touchCoordinates;
    // considering ball radius, 25, as buffer zone
    if (
      windowSize.width &&
      ballCoordinates[ballCoordinates.length - 1].x - 25 <
        touchCoordinates[touchCoordinates.length - 1].x &&
      touchCoordinates[touchCoordinates.length - 1].x <
        ballCoordinates[ballCoordinates.length - 1].x &&
      ballCoordinates[ballCoordinates.length - 1].y - 25 <
        touchCoordinates[touchCoordinates.length - 1].y &&
      touchCoordinates[touchCoordinates.length - 1].y <
        ballCoordinates[ballCoordinates.length - 1].y &&
      windowSize.width - 25 < touchCoordinates[touchCoordinates.length - 1].x
    ) {
      bubblePop();
      setCaught(true);
    }
  }, [touchCoordinates]);

  // update interval time to manipulate data record rate
  useEffect(() => {
    const intervalId = setInterval(() => {
      // time will reset on caught change (fix it)
      const elapsed = Date.now() - currentDate;
      if (caught || !isSurvey) {
        const timeData = handleStopTimer();
        closeGame(timeData);
        clearInterval(intervalId);
        return;
      }
      const lastTouch =
        touchCoordinatesRef.current[touchCoordinatesRef.current.length - 1];
      const lastBallPosition =
        ballCoordinatesRef.current[ballCoordinatesRef.current.length - 1];
      const { x: touchX, y: touchY } = lastTouch;
      const { x: objX, y: objY } = lastBallPosition;

      // console.log({ time: elapsed, touchX, touchY, objX, objY });

      setTouchX((prev: number[]) => [...prev, touchX]);
      setTouchY((prev: number[]) => [...prev, touchY]);
      setTime((prev: number[]) => [...prev, elapsed]);
      setObjX((prev: number[]) => [...prev, objX]);
      setObjY((prev: number[]) => [...prev, objY]);
    }, 20); // data records at 20ms rate

    return () => clearInterval(intervalId);
  }, [caught, isSurvey]);

  const initializeCanvas = useCallback(
    (canvasElement: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
      canvasElement.width = window.innerWidth;
      canvasElement.height = window.innerHeight;
      // ball in canvas
      // if (balls.current.length === 0) {
      //   const r = 25;
      //   const x = canvasElement.width;
      //   const y = canvasElement.height / 2;
      //   const c = "red";
      //   balls.current.push(Ball(x, y, r, c, ctx));
      // }
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
          // drawArrow(ctx, 10, 30, 200, 150);

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

          // uncomment to embed ball motion in canvas
          // balls.current.forEach((ball) => {
          //   ball.animate();
          //   if (ball.getIsMoving()) {
          //     const { x, y } = ball.getPosition();
          //     setBallCoordinatesX((prev) => [...prev, x.toFixed(2)]);
          //     setBallCoordinatesY((prev) => [...prev, y.toFixed(2)]);
          //   }

          //   // setBallCoordinates((prev)=>[...prev, ball.getPosition()])
          // });

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

  function onDraw({ prevPoint, currentPoint, ctx }: Draw) {
    if (!isDrawing || !currentPoint || !prevPoint) return;
    drawLine({ prevPoint, currentPoint, ctx, color, newlineWidth });

    setCurrentPath((prev) => [...prev, currentPoint]);
    // touchCoordinates.push({time: elapsed, x: currentPoint})
    setTouchCoordinates((prev: any) => [
      ...prev,
      { x: currentPoint.x, y: currentPoint.y },
    ]);
  }

  const handleInteractStart = () => {
    setIsDrawing(true);
    setCurrentPath([]);
    onInteractStart();
    setIsArrowVisible(false); // Hide the arrow
  };

  const handleInteractEnd = () => {
    setIsDrawing(false);
    setMouseCoordinates((prev) => [...prev, currentPath]);
  };

  const [timeResult, setTimeResult] = useState<{
    timeStart: string | null;
    timeEnd: string | null;
    timeTaken: string | null;
  } | null>(null);

  const saveImage = (): string | undefined => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ballCoordinates.forEach((item: Coordinate) => {
          ctx.beginPath();
          ctx.arc(item.x, item.y, 2, 0, Math.PI * 2);
          ctx.fillStyle = "blue";
          ctx.fill();
        });
      }

      const imageData = canvas.toDataURL("image/png");

      try {
        setIndexedDBValue(
          IndexDB_Storage.temporaryDB,
          `${IndexDB_Storage.tempImage}${popupAttempt}`,
          imageData
        );
      } catch (error) {
        console.error("Error saving audio to IndexedDB:", error);
      }

      const link = document.createElement("a");
      link.download = imagefile;
      link.href = imageData;
      link.click();

      // return Base64 image data
      return imageData;
    }
    return undefined;
  };

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

  const handleStartGame = () => {
    handleTimer();
    trackTaskTime("start"); // Start tracking time

    setSurveyData((prevState: any) => ({
      ...prevState,
    }));
  };

  const closeGame = useCallback(
    async (timeData?: any, closedMidWay: boolean = false) => {
      if (isSurvey) {
        const image = saveImage();
        setShowPopup((prev) => {
          return !prev;
        });

        setSurveyData((prevState: any) => {
          const updatedSurveyData = {
            ...prevState,
            timeTaken: timeData.timeTaken,
            timrLimit: timeData?.timeLimit || "",
            endTime: timeData?.endTime || "",
            startTime: timeData?.startTime || "",
            closedWithTimeout: timeData?.isTimeOver || false,
            touchX,
            touchY,
            objX,
            objY,
            time,
            screenHeight: windowSize.height,
            screenWidth: windowSize.width,
            deviceType,
            closedMidWay,
            // image,
          };
          dispatch({
            type: "UPDATE_SURVEY_DATA",
            attempt: popupAttempt,
            task: TaskContent.id,
            data: updatedSurveyData,
          });

          return updatedSurveyData;
        });
      }
    },

    [
      isSurvey,
      timerData,
      popupAttempt,
      showPopup,
      touchX,
      touchY,
      objX,
      objY,
      time,
    ]
  );

  useEffect(() => {
    if (isSurvey) {
      handleStartGame();
    }
  }, []);

  // useEffect(() => {
  //   if (popupAttempt > SURVEY_MAX_ATTEMPTS) {
  //     router.push(PAGE_ROUTES.SURVEY.path);
  //   }
  // }, [attempt, router]);

  const handleCloseGame = (midway: boolean = false) => {
    const timeData = handleStopTimer();
    closeGame(timeData, midway);
  };

  useEffect(() => {
    console.log("popupAttempt", popupAttempt);
  }, [popupAttempt]);

  if (windowSize.height && windowSize.width !== undefined) {
    return (
      <div className="relative w-screen h-screen overflow-hidden">
        {isSurvey && (
          <CloseGesture handlePressAction={() => handleCloseGame(true)} />
        )}
        {isSurvey && (
          <div className="absolute z-50">
            <div className="fixed top-4 left-4 flex flex-col space-y-2">
              <button
                className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/80"
                onClick={() => handleCloseGame()}
              >
                Save
              </button>
            </div>
            <MessagePopup
              showFilter={showPopup}
              msg={TaskContent.taskEndMessage}
              testName={TaskContent.title}
              showAction={popupAttempt < SURVEY_MAX_ATTEMPTS}
            />
          </div>
        )}
        <canvas
          id="canvas"
          width={windowSize.width}
          height={windowSize.height}
          ref={canvasRef}
          onMouseDown={handleInteractStart}
          onMouseUp={handleInteractEnd}
          onTouchStart={handleInteractStart}
          onTouchEnd={handleInteractEnd}
          className="z-40 absolute top-0 left-0 w-full h-full cursor-pointer"
        />
        <div className="absolute w-screen h-screen z-30">
          <BallAnimation
            width={windowSize.width}
            height={windowSize.height}
            attempt={popupAttempt}
            isSurvey={isSurvey}
          />
        </div>
        {isArrowVisible && (
          <div
            id="arrow-div"
            className="z-10 absolute flex items-center top-0 left-0 w-full h-full bg-cover bg-center"
          >
            <Image
              src={`${BASE_URL}/image/arrow.png`}
              alt={"arrow"}
              width={100}
              height={100}
              className="absolute rotate-45"
            />
          </div>
        )}
        <div
          className="z-0 absolute top-0 left-0 w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url('${BASE_URL}/image/motor_bg.jpg')` }}
        ></div>
      </div>
    );
  }
  return null;
}

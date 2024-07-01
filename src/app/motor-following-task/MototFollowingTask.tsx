"use client";

import React, { useRef, useEffect, useState } from "react";
import useDraw from "@hooks/useDraw";
import useWindowSize from "@hooks/useWindowSize";
import { drawLine } from "@utils/canva";
import Ball from "./Ball"; // Use the Ball function
import MessagePopup from "components/common/MessagePopup";
import { useSearchParams } from "next/navigation";

interface Coordinate {
  x: number;
  y: number;
}

export default function MototFollowingTask({ isSample = false }) {
  const { windowSize } = useWindowSize();
  const color = "#000000";
  const newlineWidth = 3;

  const { canvasRef, onInteractStart } = useDraw(onDraw);
  const [mouseCoordinates, setMouseCoordinates] = useState<Coordinate[][]>([]);
  const [BallCoordinates, setBallCoordinates] = useState<any[]>([]);
  const [currentPath, setCurrentPath] = useState<Coordinate[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const balls = useRef<any[]>([]);
  const animationRef = useRef<number | null>(null);
  const [showPopup, setShowPopup] = useState<boolean>(false);

  const searchParams = useSearchParams();
  const attemptString = searchParams.get("attempt") || "0";
  const attempt = parseInt(attemptString);
  const reAttemptUrl =
    attempt < 3 ? `motor-follwing-task?attempt=${attempt + 1}` : null;

  function onDraw({ prevPoint, currentPoint, ctx }: Draw) {
    if (!isDrawing || !currentPoint || !prevPoint) return;

    const drawOptions = {
      prevPoint,
      currentPoint,
      ctx,
      color,
      newlineWidth,
    };
    drawLine(drawOptions);

    // Update current path
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
  };

  useEffect(() => {
    const canvasElement = canvasRef.current;

    if (canvasElement) {
      canvasElement.width = window.innerWidth;
      canvasElement.height = window.innerHeight;

      // Set background image
      canvasElement.style.backgroundImage = 'url("/motor_bg.jpg")';
      canvasElement.style.backgroundSize = "cover";
      canvasElement.style.backgroundPosition = "center";

      const ctx = canvasElement.getContext("2d");

      if (ctx) {
        // Initialize balls if not already initialized
        if (balls.current.length === 0) {
          let r = Math.floor(Math.random() * 30) + 15;
          let x = canvasElement.width;
          let y = canvasElement.height / 2;
          let c = "red";
          const ball = Ball(x, y, r, c, ctx);
          balls.current.push(ball);
        }

        // Animation function
        const update = () => {
          ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);

          // Redraw all previous paths
          mouseCoordinates.forEach((path) => {
            for (let i = 1; i < path.length; i++) {
              const prevPoint = path[i - 1];
              const currentPoint = path[i];
              drawLine({ prevPoint, currentPoint, ctx, color, newlineWidth });
            }
          });

          // Draw current path
          for (let i = 1; i < currentPath.length; i++) {
            const prevPoint = currentPath[i - 1];
            const currentPoint = currentPath[i];
            drawLine({ prevPoint, currentPoint, ctx, color, newlineWidth });
          }

          // Animate balls
          balls.current.forEach((ball) => {
            ball.animate();
            BallCoordinates.push(ball.getPosition());
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
  }, [mouseCoordinates, currentPath, windowSize]);

  useEffect(() => {
    const canvasElement = canvasRef.current;

    if (canvasElement) {
      const ctx = canvasElement.getContext("2d");

      if (ctx) {
        // Reinitialize the canvas size and background on resize
        canvasElement.width = window.innerWidth;
        canvasElement.height = window.innerHeight;

        // Set background image
        canvasElement.style.backgroundImage = 'url("/motor_bg.jpg")';
        canvasElement.style.backgroundSize = "cover";
        canvasElement.style.backgroundPosition = "center";

        // Initialize balls if not already initialized
        if (balls.current.length === 0) {
          let r = Math.floor(Math.random() * 30) + 15;
          let x = canvasElement.width;
          let y = canvasElement.height / 2;
          let c = "red";
          const ball = Ball(x, y, r, c, ctx);
          balls.current.push(ball);
        }
      }
    }
  }, [windowSize]);

  const saveImage = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const link = document.createElement("a");
      link.download = "drawing.png";
      link.href = canvas.toDataURL();
      link.click();
    }
    setShowPopup((prev) => !prev);
  };

  console.log({ mouseCoordinates, BallCoordinates });

  if (windowSize.height && windowSize.width !== undefined) {
    return (
      <div>
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
        {!isSample && (
          <div>
            <div className="absolute top-4 right-4 flex flex-col space-y-2">
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                onClick={saveImage}
              >
                Save
              </button>
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
        )}
      </div>
    );
  }
  return null;
}

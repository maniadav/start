"use client";
import { useEffect, useState } from "react";

interface BubbleProps {
  color: string;
  onClick: (
    ballCoordString: string,
    mouseCoordString: string,
    color: string
  ) => void;
  bubbleSize: number;
  screenWidth: number;
  screenHeight: number;
  initialPosition: { x: number; y: number };
}

const Bubble = ({
  color,
  onClick,
  bubbleSize,
  screenWidth,
  screenHeight,
  initialPosition,
}: BubbleProps) => {
  const [position, setPosition] = useState(initialPosition);

  const [speed] = useState(Math.random() * 4 + 2); // Random speed between 1 and 5

  const handleBallTouch = (event: React.MouseEvent<HTMLDivElement>) => {
    const relativeX = (position.x / screenWidth) * 100;
    const relativeY =
      ((screenHeight - position.y - bubbleSize) / screenHeight) * 100;
    const ballCoordString = `${relativeX.toFixed(2)}-${relativeY.toFixed(2)}`;

    const xPercent = (event.clientX / window.innerWidth) * 100;
    const yPercent =
      ((window.innerHeight - event.clientY) / window.innerHeight) * 100;
    const mouseCoordString = `${xPercent.toFixed(2)}-${yPercent.toFixed(2)}`;

    onClick(ballCoordString, mouseCoordString, color);
  };

  useEffect(() => {
    let increasing = true;

    const intervalId = setInterval(() => {
      setPosition((prevPosition) => {
        let newY = 0;
        if (increasing) {
          newY = prevPosition.y - speed;
          if (newY <= 0) {
            increasing = false;
            newY = prevPosition.y + speed;
          }
        } else {
          newY = prevPosition.y + speed;
          if (newY >= screenHeight - bubbleSize) {
            increasing = true;
            newY = prevPosition.y - speed;
          }
        }
        return { ...prevPosition, y: newY };
      });
    }, 50);

    return () => clearInterval(intervalId);
  }, [bubbleSize, screenHeight, speed]);

  return (
    <div
      className="cursor-pointer bubble absolute rounded-full block"
      style={{
        position: "absolute",
        top: position.y,
        left: position.x,
        backgroundColor: color,
        width: `${bubbleSize}px`,
        height: `${bubbleSize}px`,
      }}
      onClick={handleBallTouch}
    ></div>
  );
};

export default Bubble;

"use client";
import { useEffect, useState } from "react";

interface BubbleProps {
  color: string;
  onClick: (
    ballCoordX: number,
    ballCoordY: number,
    mouseCoordX: number,
    mouseCoordY: number,
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
  const [speed] = useState(Math.random() * 4 + 2);
  const [direction, setDirection] = useState(-1); // -1 for up, 1 for down

  const handleBallTouch = (event: React.MouseEvent<HTMLDivElement>) => {
    // Calculate bubble center coordinate, posotion is top left point
    const bubbleCenterX = position.x + bubbleSize / 2;
    const bubbleCenterY = position.y + bubbleSize / 2;

    // Convert to percentages relative to screen dimensions
    const ballCoordX = (bubbleCenterX / screenWidth) * 100;
    const ballCoordY = (bubbleCenterY / screenHeight) * 100;

    // Mouse coordinates relative to screen
    const mouseCoordX = (event.clientX / window.innerWidth) * 100;
    const mouseCoordY = (event.clientY / window.innerHeight) * 100;
    console.log({ ballCoordY, mouseCoordY });
    onClick(
      parseFloat(ballCoordX.toFixed(2)),
      parseFloat(ballCoordY.toFixed(2)),
      parseFloat(mouseCoordX.toFixed(2)),
      parseFloat(mouseCoordY.toFixed(2)),
      color
    );
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setPosition((prev) => {
        const newY = prev.y + speed * direction;
        const maxY = screenHeight - bubbleSize;

        // Check boundaries and reverse direction
        if (newY <= 0) {
          setDirection(1);
          return { ...prev, y: 0 };
        }
        if (newY >= maxY) {
          setDirection(-1);
          return { ...prev, y: maxY };
        }
        return { ...prev, y: newY };
      });
    }, 50);

    return () => clearInterval(intervalId);
  }, [direction, bubbleSize, screenHeight, speed]);

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
        transform: "translateZ(0)", // Improve animation performance
      }}
      onClick={handleBallTouch}
    >
      {/* {`${position.x}-${position.y}`} */}
    </div>
  );
};

export default Bubble;

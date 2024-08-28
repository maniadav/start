"use client";
import { useEffect, useState } from "react";

interface ButtonCanvasProps {
  handleButtonClick: any;
}

export const getPosition = () => {
  const useFirstRange = Math.random() < 0.5;
  const [min, max] = useFirstRange ? [1, 4] : [6, 9];
  const [minH, maxH] = useFirstRange ? [2, 4] : [6, 8];

  return {
    blue: {
      top: getRandomPosition(minH, maxH),
      right: getRandomPosition(min, max),
    },
    red: {
      bottom: getRandomPosition(minH, maxH),
      left: getRandomPosition(min, max),
    },
  };
};

const getRandomPosition = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min) + min) * 10;

export const ButtonCanvas = ({ handleButtonClick }: ButtonCanvasProps) => {
  const [positions, setPositions] = useState(getPosition());

  const [animate, setAnimate] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimate(false);
      // const useFirstRange = Math.random() < 0.5;
      // const [min, max] = useFirstRange ? [1, 4] : [6, 9];

      // setPositions({
      //   blue: {
      //     top: getRandomPosition(min, max),
      //     right: getRandomPosition(min, max),
      //   },
      //   red: {
      //     bottom: getRandomPosition(min, max),
      //     left: getRandomPosition(min, max),
      //   },
      // });
    }, 6000);
  });

  return (
    <div className="w-screen h-screen relative">
      <div
        className={`absolute ${
          animate ? "animate-redBall" : ""
        } w-[180px] h-[180px] bg-red-800 shadow-2xl border-2 border-red-900 rounded-full absolute`}
        style={{
          bottom: `${positions.red.bottom}%`,
          left: `${positions.red.left}%`,
        }}
        onClick={() => handleButtonClick("red")}
      ></div>
      <div
        className={`${
          animate ? "animate-blueBall" : ""
        } w-[180px] h-[180px] bg-blue-800 shadow-2xl border-2 border-blue-900 rounded-full absolute`}
        style={{
          top: `${positions.blue.top}%`,
          right: `${positions.blue.right}%`,
        }}
        onClick={() => handleButtonClick("blue")}
      ></div>
    </div>
  );
};

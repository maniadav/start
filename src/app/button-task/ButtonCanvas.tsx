"use client";
import { useEffect, useState } from "react";

interface ButtonCanvasProps {
  handleButtonClick: any;
}

const getRandomPosition = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min) + min) * 10;

export const ButtonCanvas = ({ handleButtonClick }: ButtonCanvasProps) => {
  const [positions, setPositions] = useState({
    blue: {
      top: 50,
      right: (Math.floor(Math.random() * 3) + 1) * 10,
    },
    red: {
      top: 50,
      left: (Math.floor(Math.random() * 3) + 1) * 10,
    },
  });

  const [animate, setAnimate] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimate(false);
      const useFirstRange = Math.random() < 0.5;
      const [min, max] = useFirstRange ? [1, 4] : [6, 9];

      setPositions({
        blue: {
          top: 50,
          right: getRandomPosition(min, max),
        },
        red: {
          top: 50,
          left: getRandomPosition(min, max),
        },
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      <div
        className={`${
          animate ? "redBall" : ""
        } w-[200px] h-[200px] bg-red-800 shadow-2xl border-2 border-red-900 rounded-full absolute`}
        style={{
          top: `${positions.red.top}%`,
          left: `${positions.red.left}%`,
        }}
        onClick={() => handleButtonClick("red")}
      ></div>
      <div
        className={`${
          animate ? "blueBall" : ""
        } w-[200px] h-[200px] bg-blue-800 shadow-2xl border-2 border-blue-900 rounded-full absolute`}
        style={{
          top: `${positions.blue.top}%`,
          right: `${positions.blue.right}%`,
        }}
        onClick={() => handleButtonClick("blue")}
      ></div>

      <style jsx>{`
        @keyframes slideRed {
          0% {
            left: 10%;
          }
          50% {
            left: 80%;
          }
          100% {
            left: 10%;
          }
        }

        @keyframes slideBlue {
          0% {
            right: 10%;
          }
          50% {
            right: 80%;
          }
          100% {
            right: 10%;
          }
        }

        .redBall {
          animation: slideRed 1s linear infinite;
        }

        .blueBall {
          animation: slideBlue 1s linear infinite;
        }
      `}</style>
    </div>
  );
};

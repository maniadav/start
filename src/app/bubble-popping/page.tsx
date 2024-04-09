"use client";
import { useState, useEffect } from "react";
import Bubble from "./Bubble";
import Image from "next/image";
const colors = ["red", "green", "blue", "yellow", "purple", "orange"];

const IndexPage = () => {
  const [bubbles, setBubbles] = useState<any>([]);
  const [poppedBubbles, setPoppedBubbles] = useState<any>([]);
  const [startTime, setStartTime] = useState<any>(null);

  useEffect(() => {
    setBubbles(
      [...Array(6).keys()].map((id: number) => ({
        id,
        color: colors[id],
        popped: false,
      }))
    );
  }, []);

  const popBubble = (id: any) => {
    setBubbles((prevBubbles: any[]) =>
      prevBubbles.map((bubble) =>
        bubble.id === id ? { ...bubble, popped: true } : bubble
      )
    );
    setPoppedBubbles((prevPoppedBubbles: any) => [...prevPoppedBubbles, id]);
  };

  const handleStartGame = () => {
    setStartTime(Date.now());
  };

  const handleResetGame = () => {
    setBubbles(bubbles.map((bubble: any) => ({ ...bubble, popped: false })));
    setPoppedBubbles([]);
    setStartTime(null);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <Image src="/ocean.jpg" layout="fill" objectFit="cover" alt="ocean" />
      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
        <div className="flex flex-wrap justify-center">
          {bubbles.map((bubble: { id: any; color: any; popped: any }) => (
            <Bubble
              key={bubble.id}
              color={bubble.color}
              popped={bubble.popped}
              onClick={() => popBubble(bubble.id)}
              bubbleSize={100}
            />
          ))}
          {/* <BallComponent /> */}
        </div>
      </div>

      <div className="absolute bottom-5 left-5">
        <button
          className="rounded bg-gray-800 text-gray-300 px-2 py-1 "
          onClick={handleStartGame}
        >
          Start Game
        </button>
      </div>

      <p className="absolute bottom-5 right-5">
        Time elapsed:{" "}
        {startTime
          ? `${((Date.now() - startTime) / 1000).toFixed(2)} seconds`
          : "Not started"}
      </p>
      <p className="absolute bottom-20 right-5">
        Color sequence:{" "}
        {poppedBubbles.map((id: number) => colors[id]).join(", ")}
      </p>
    </div>
  );
};

export default IndexPage;

const BallComponent = () => {
  const floatAnimation = `
    @keyframes float {
      0% {
        transform: translateY(0px);
      }
      50% {
        transform: translateY(-500px);
      }
      100% {
        transform: translateY(0px);
      }
    }
  `;

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-blue-300 to-pink-300">
      <style>{floatAnimation}</style>
      <div
        className="animate-float h-24 w-24 rounded-full bg-gradient-radial"
        style={{ animation: "float 3.5s ease-in-out infinite" }}
      ></div>
    </div>
  );
};

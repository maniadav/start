import React from "react";
import { useState, useEffect } from "react";
import Bubble from "./Bubble";
import Image from "next/image";
import { CommonButton } from "components/common/CommonButton";
const colors = ["red", "green", "blue", "yellow", "purple", "orange"];

const BubbleGame = () => {
  const [bubbles, setBubbles] = useState<string[]>(colors);
  const [numberOfBubbles, setNumberOfBubbles] = useState<number>(6);
  const [poppedBubbles, setPoppedBubbles] = useState<any>([]);
  const [startTime, setStartTime] = useState<any>(null);

  useEffect(() => {
    // setBubbles(
    //   [...Array(6).keys()].map((id: number) => ({
    //     id,
    //     color: colors[id],
    //     popped: false,
    //   }))
    // );

    if (numberOfBubbles === 6) {
      console.log("end it");
    } else {
      console.log(numberOfBubbles, "check", bubbles.slice(0, numberOfBubbles));
      setBubbles((prevBubbles) => prevBubbles.slice(0, numberOfBubbles + 1));
      setNumberOfBubbles((numberOfBubbles) => numberOfBubbles + 1);
    }
  }, [bubbles, numberOfBubbles]);

  //   const popBubble = (id: any) => {
  //     setBubbles((prevBubbles: any[]) =>
  //       prevBubbles.map((bubble) =>
  //         bubble.id === id ? { ...bubble, popped: true } : bubble
  //       )
  //     );
  //     setPoppedBubbles((prevPoppedBubbles: any) => [...prevPoppedBubbles, id]);
  //   };
  const popBubble = (color: string) => {
    console.log(color);
    setBubbles((bubble) =>
      bubble.filter((prevBubbles) => prevBubbles !== color)
    );
  };

  const handleStartGame = () => {
    setNumberOfBubbles(1);
    setStartTime(Date.now());
  };

  const handleResetGame = () => {
    // setNumberOfBubble(1)
    // setBubbles(bubbles.map((bubble: any) => ({ ...bubble, popped: false })));
    // setPoppedBubbles([]);
    setStartTime(null);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <Image src="/ocean.jpg" layout="fill" objectFit="cover" alt="ocean" />
      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
        <div className="flex flex-wrap justify-center">
          {bubbles.map((color: string) => (
            // <Bubble
            //   key={bubble.id}
            //   color={bubble.color}
            //   popped={bubble.popped}
            //   onClick={() => popBubble(bubble.id)}
            //   bubbleSize={100}
            // />
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

export default BubbleGame;

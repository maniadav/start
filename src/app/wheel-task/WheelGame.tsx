"use client";

import React from "react";
import { useState, useEffect } from "react";
import Image from "next/image";
import { CommonButton } from "components/common/CommonButton";
import SurveyTable from "components/SurveyTable";
import MessagePopup from "components/common/MessagePopup";
// import { useSearchParams } from "next/navigation";
const colors = ["red", "green", "blue", "yellow", "purple", "orange"];

const WheelGame = ({ sample = false }: any) => {
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<any>(null);
  // const searchParams = useSearchParams();
  const attempt ="0"// searchParams.get("attempt") || "0";
  const reAttemptUrl =
    parseInt(attempt) < 3
      ? `bubble-popping-task?attempt=${parseInt(attempt) + 1}`
      : null;

  useEffect(() => {
    setStartTime(Date.now());
  }, []);

  const handleCloseGame = () => {
    setShowPopup(true);
    console.log(`${((Date.now() - startTime) / 1000).toFixed(2)} seconds`);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <div className="relative h-screen w-full">
        <Image
          src="/hallucination.gif"
          layout="fill"
          objectFit="contain"
          alt="ocean"
          className="h-screen w-auto"
        />
      </div>

      <div className="absolute bottom-5 left-5">
        <button
          className="border border-black shadow-lg rounded-full bg-primary w-12 h-12 px-2 py-1 "
          onClick={handleCloseGame}
        ></button>
      </div>
      {!sample && (
        <MessagePopup
          showFilter={showPopup}
          msg={
            "You have completed the Bubble Popping Task. You can now make another attempt for this test, go back to the survey dashboard or start the new task. "
          }
          attempt={attempt}
          testName={"bubble popping"}
          reAttemptUrl={reAttemptUrl}
        />
      )}
    </div>
  );
};

export default WheelGame;

"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { CommonButton } from "components/common/CommonButton";
import { TasksConstant } from "constants/tasks.constant";
import { useSearchParams } from "next/navigation";
import MessagePopup from "components/common/MessagePopup";
import TaskHome from "components/TaskHome";
import WheelGame from "./WheelGame";
import SuspenseWrapper from "components/SuspenseWrapper";
const colors: string[] = ["red", "green", "blue", "yellow", "purple", "orange"];

const IndexPage = () => {
  const [survey, setSurvey] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<any>(null);

  const data = TasksConstant.WheelTask;

  const handleStartGame = () => {
    setSurvey(!survey);
    setStartTime(Date.now());
  };

  return (
    <>
      {survey ? (
        <div className="w-full h-full overflow-hidden">
          <WheelGame isSurvey={true} />
        </div>
      ) : (
        <div className="w-full h-full overflow-hidden">
          <TaskHome
            taskName={data.title}
            taskMessage={data.taskMessage}
            handleStartGame={() => handleStartGame()}
          />
          <WheelGame />
        </div>
      )}
    </>
  );
};

export default function Page() {
  return (
    <SuspenseWrapper>
      <IndexPage />
    </SuspenseWrapper>
  );
}

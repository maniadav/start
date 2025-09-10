"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { CommonButton } from "@components/ui/CommonButton";
import { TasksConstant } from "constants/tasks.constant";
import { useSearchParams } from "next/navigation";
import MessagePopup from "@components/ui/MessagePopup";
import TaskHome from "components/TaskHome";
import LanguageSamplingTask from "./LanguageSamplingTask";
import SuspenseWrapper from "components/SuspenseWrapper";
import { LanguageSamplingContent as TaskContent } from "constants/tasks.constant";

const IndexPage = () => {
  const [survey, setSurvey] = useState<boolean>(false);

  const handleStartGame = () => {
    setSurvey(!survey);
  };

  return (
    <>
      {survey ? (
        <div className="w-full h-full overflow-hidden">
          <LanguageSamplingTask isSurvey={true} />
        </div>
      ) : (
        <div className="w-full h-full overflow-hidden">
          <TaskHome
            taskName={TaskContent.title}
            taskMessage={TaskContent.taskMessage}
            handleStartGame={() => handleStartGame()}
          />
          <LanguageSamplingTask />
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

"use client";
import { useState } from "react";
import TaskHome from "components/ui/TaskHome";
import LanguageSamplingTask from "./LanguageSamplingTask";
import SuspenseWrapper from "components/wrapper/SuspenseWrapper";
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

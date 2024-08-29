"use client";
import { useState } from "react";
import { TasksConstant } from "constants/tasks.constant";
import TaskHome from "components/TaskHome";
import LanguageSamplingTask from "./PreferentialLookingTask";
import SuspenseWrapper from "components/SuspenseWrapper";

const IndexPage = () => {
  const [survey, setSurvey] = useState<boolean>(false);

  const data = TasksConstant.PreferentialLookingTask;

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
            taskName={data.title}
            taskMessage={data.taskMessage}
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

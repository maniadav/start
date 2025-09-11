"use client";
import * as React from "react";
import { useState } from "react";
import { TasksConstant } from "constants/tasks.constant";
import TaskHome from "components/ui/TaskHome";
import SynchronyTask from "./SynchronyTask";
import SuspenseWrapper from "components/wrapper/SuspenseWrapper";
import { SynchronyStateProvider } from "state/provider/SynchronyStateProvider";
import FullScreenWrapper from "components/wrapper/FullScreenWrapper";
import { SynchronyContent as TaskContent } from "constants/tasks.constant";

const IndexPage = () => {
  const [survey, setSurvey] = useState<boolean>(false);

  const handleStartGame = () => {
    setSurvey(!survey);
  };

  return (
    <>
      {survey ? (
        <FullScreenWrapper isFullScreen={survey}>
          <SynchronyTask isSurvey={true} />
        </FullScreenWrapper>
      ) : (
        <div className="w-full h-full overflow-hidden">
          <TaskHome
            taskName={TaskContent.title}
            taskMessage={TaskContent.taskMessage}
            handleStartGame={() => handleStartGame()}
          />
          <SynchronyTask />
        </div>
      )}
    </>
  );
};

export default function Page() {
  return (
    <SuspenseWrapper>
      <SynchronyStateProvider>
        <IndexPage />
      </SynchronyStateProvider>
    </SuspenseWrapper>
  );
}

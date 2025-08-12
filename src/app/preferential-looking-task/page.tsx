"use client";
import React from "react";
import { useState } from "react";
import TaskHome from "components/TaskHome";
import PreferentialLookingTask from "./PreferentialLookingTask";
import SuspenseWrapper from "components/SuspenseWrapper";
import { PreferentialLookingStateProvider } from "state/provider/PreferentialLookingStateProvider";
import FullScreenWrapper from "components/FullScreenWrapper";
import { PreferentialLookingContent as TaskContent } from "@constants/tasks.constant";

const IndexPage = () => {
  const [survey, setSurvey] = useState<boolean>(false);

  const handleStartGame = () => {
    setSurvey(!survey);
  };

  return (
    <>
      {survey ? (
        <FullScreenWrapper isFullScreen={survey}>
          <PreferentialLookingTask isSurvey={survey} />
        </FullScreenWrapper>
      ) : (
        <div className="w-full h-full overflow-hidden">
          <TaskHome
            taskName={TaskContent.title}
            taskMessage={TaskContent.taskMessage}
            handleStartGame={() => handleStartGame()}
          />
          <PreferentialLookingTask />
        </div>
      )}
    </>
  );
};

export default function Page() {
  return (
    <SuspenseWrapper>
      <PreferentialLookingStateProvider>
        <IndexPage />
      </PreferentialLookingStateProvider>
    </SuspenseWrapper>
  );
}

"use client";
import { useState } from "react";
import TaskComponent from "./PreferentialLookingTask";
import { PreferentialLookingContent as TaskContent } from "@constants/tasks.constant";
import FullScreenWrapper from "components/wrapper/FullScreenWrapper";
import TaskHome from "components/ui/TaskHome";
import SuspenseWrapper from "components/wrapper/SuspenseWrapper";
import { PreferentialLookingStateProvider } from "state/provider/PreferentialLookingStateProvider";

const IndexPage = () => {
  const [survey, setSurvey] = useState<boolean>(false);
  const handleStartGame = (prev: boolean) => setSurvey(!prev);
  return (
    <FullScreenWrapper isFullScreen={survey}>
      {!survey && (
        <TaskHome
          taskName={TaskContent.title}
          taskMessage={TaskContent.taskMessage}
          handleStartGame={handleStartGame}
        />
      )}
      <TaskComponent isSurvey={survey} />
    </FullScreenWrapper>
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

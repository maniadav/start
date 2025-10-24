"use client";
import { useState } from "react";
import TaskComponent from "./BubblePoppingTask";
import { BubblePoppingContent as TaskContent } from "constants/tasks.constant";
import FullScreenWrapper from "@components/wrapper/FullScreenWrapper";
import TaskHome from "@components/ui/TaskHome";
import SuspenseWrapper from "@components/wrapper/SuspenseWrapper";

const IndexPage = () => {
  const [survey, setSurvey] = useState<boolean>(false);

  const handleStartGame = () => {
    setSurvey(!survey);
  };

  return (
    <FullScreenWrapper isFullScreen={survey}>
      {!survey && (
        <TaskHome
          taskName={TaskContent.title}
          taskMessage={TaskContent.taskMessage}
          handleStartGame={(prev: boolean) => setSurvey(!prev)}
        />
      )}
      <TaskComponent isSurvey={survey} />
    </FullScreenWrapper>
  );
};

export default function Page() {
  return (
    <SuspenseWrapper>
      <IndexPage />
    </SuspenseWrapper>
  );
}

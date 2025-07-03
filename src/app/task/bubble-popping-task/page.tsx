"use client";
import { useState } from "react";
import { BubblePoppingContent } from "constants/tasks.constant";
import TaskHome from "components/TaskHome";
import SuspenseWrapper from "components/SuspenseWrapper"; // Import the wrapper component
import BubblePoppingTask from "./BubblePoppingTask";
import { BubblePoppingContent as TaskContent } from "constants/tasks.constant";
import FullScreenWrapper from "components/FullScreenWrapper";

const IndexPage = () => {
  const [survey, setSurvey] = useState<boolean>(false);

  const handleStartGame = () => {
    setSurvey(!survey);
  };

  return (
    <>
      {survey ? (
        <FullScreenWrapper isFullScreen={survey}>
          <BubblePoppingTask isSurvey={true} />
        </FullScreenWrapper>
      ) : (
        <div className="w-full h-full overflow-hidden">
          <TaskHome
            taskName={TaskContent.title}
            taskMessage={TaskContent.taskMessage}
            handleStartGame={() => handleStartGame()}
          />
          <BubblePoppingTask />
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

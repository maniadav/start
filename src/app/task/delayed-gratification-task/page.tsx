"use client";
import { useState } from "react";
import TaskHome from "components/ui/TaskHome";
import LanguageSamplingTask from "./DelayedGratificationTask";
import SuspenseWrapper from "components/wrapper/SuspenseWrapper";
import DelayedGratificationTask from "./DelayedGratificationTask";
import FullScreenWrapper from "components/wrapper/FullScreenWrapper";
import { DelayedGratificationContent as TaskContent } from "constants/tasks.constant";

const IndexPage = () => {
  const [survey, setSurvey] = useState<boolean>(false);

  const handleStartGame = () => {
    setSurvey(!survey);
  };

  return (
    <>
      {survey ? (
        <FullScreenWrapper isFullScreen={survey}>
          <DelayedGratificationTask isSurvey={true} />
        </FullScreenWrapper>
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

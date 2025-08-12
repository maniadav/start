"use client";
import { useState } from "react";
import { TasksConstant } from "constants/tasks.constant";
import TaskHome from "components/TaskHome";
import WheelGame from "./WheelGame";
import SuspenseWrapper from "components/SuspenseWrapper";
import FullScreenWrapper from "components/FullScreenWrapper";
import { WheelContent as TaskContent } from "constants/tasks.constant";

const IndexPage = () => {
  const [survey, setSurvey] = useState<boolean>(false);

  const handleStartGame = () => {
    setSurvey(!survey);
  };

  return (
    <>
      {survey ? (
        <FullScreenWrapper isFullScreen={survey}>
          <WheelGame isSurvey={survey} />
        </FullScreenWrapper>
      ) : (
        <div className="w-full h-full overflow-hidden">
          <TaskHome
            taskName={TaskContent.title}
            taskMessage={TaskContent.taskMessage}
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

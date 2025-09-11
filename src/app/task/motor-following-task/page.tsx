"use client";
import { useState } from "react";
import { TasksConstant } from "constants/tasks.constant";
import TaskHome from "components/ui/TaskHome";
import SuspenseWrapper from "components/wrapper/SuspenseWrapper"; // Import the wrapper component
import MototFollowingTask from "./MototFollowingTask";
import { MotorStateProvider } from "state/provider/MotorStateProvider";
import { MotorFollowingContent as TaskContent } from "constants/tasks.constant";
import FullScreenWrapper from "components/wrapper/FullScreenWrapper";

const IndexPage = () => {
  const [survey, setSurvey] = useState<boolean>(false);

  const handleStartGame = () => {
    setSurvey(!survey);
  };

  return (
    <>
      {survey ? (
        <FullScreenWrapper isFullScreen={survey}>
          <MototFollowingTask isSurvey={true} />
        </FullScreenWrapper>
      ) : (
        <div className="w-full h-full overflow-hidden">
          <TaskHome
            taskName={TaskContent.title}
            taskMessage={TaskContent.taskMessage}
            handleStartGame={() => handleStartGame()}
          />
          <MototFollowingTask />
        </div>
      )}
    </>
  );
};

export default function Page() {
  return (
    <SuspenseWrapper>
      <MotorStateProvider>
        <IndexPage />
      </MotorStateProvider>
    </SuspenseWrapper>
  );
}

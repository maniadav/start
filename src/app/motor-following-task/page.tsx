"use client";
import { useState } from "react";
import { TasksConstant } from "constants/tasks.constant";
import TaskHome from "components/TaskHome";
import SuspenseWrapper from "components/SuspenseWrapper"; // Import the wrapper component
import MototFollowingTask from "./MototFollowingTask";
import { MotorStateProvider } from "state/provider/MotorStateProvider";

const IndexPage = () => {
  const data = TasksConstant.BubblePoppingTask;
  const [survey, setSurvey] = useState<boolean>(false);

  const handleStartGame = () => {
    setSurvey(!survey);
  };

  return (
    <>
      {survey ? (
        <div>
          <MototFollowingTask isSurvey={true} />
        </div>
      ) : (
        <div className="w-full h-full overflow-hidden">
          <TaskHome
            taskName={data.title}
            taskMessage={data.taskMessage}
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

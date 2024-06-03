import React from "react";
import { TasksConstant } from "constants/tasks.constant";
import { CommonButton } from "components/common/CommonButton";
import WheeGame from "./WheeGame";
import TaskHome from "components/TaskHome";

const page = () => {
  const data = TasksConstant.wheelTask;
  function handleStartGame(): any {
    alert("Function not implemented.");
  }

  return (
    <div className="w-full h-full overflow-hidden">
      <TaskHome
        taskName={data.title}
        taskMessage={data.taskMessage}
        handleStartGame={() => handleStartGame()}
      />
      <WheeGame />
    </div>
  );
};

export default page;

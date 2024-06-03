import React, { Children } from "react";
import { CommonButton } from "./common/CommonButton";

interface TaskHomeInterface {
  taskName: any;
  taskMessage: any;
  handleStartGame: any;
}

const TaskHome = ({
  taskName,
  taskMessage,
  handleStartGame,
}: TaskHomeInterface) => {
  return (
    <div className="w-full h-full overflow-hidden">
      <div className="w-full h-auto text-center text-3xl text-primary pt-12">
        {taskName}
      </div>
      <div className="w-full h-auto p-5 flex justify-between text-gray-500">
        <p>
          Say to the child
          <strong className="">{`, "${taskMessage}"`}</strong>
        </p>
        <CommonButton
          labelText={"Start Survey"}
          clicked={() => handleStartGame()}
        />
      </div>
    </div>
  );
};

export default TaskHome;

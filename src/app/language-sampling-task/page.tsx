import TaskHome from "components/TaskHome";
import { TasksConstant } from "constants/tasks.constant";

const page = () => {
  const data = TasksConstant.wheelTask;
  return (
    <div className="w-full h-full overflow-hidden">
      <TaskHome taskName={data.taskName} taskMessage={data.taskMessage}>
        <h1>lanuae Samplin</h1>
      </TaskHome>
    </div>
  );
};

export default page;

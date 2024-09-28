'use client';
import { useState } from 'react';
import { TasksConstant } from 'constants/tasks.constant';
import TaskHome from 'components/TaskHome';
import SuspenseWrapper from 'components/SuspenseWrapper';
import ButtonTask from './ButtonTask';
import FullScreenWrapper from 'components/FullScreenWrapper';

const IndexPage = () => {
  const data = TasksConstant.ButtonTask;
  const [survey, setSurvey] = useState<boolean>(false);

  const handleStartGame = () => {
    setSurvey(!survey);
  };

  return (
    <>
      {survey ? (
        <div>
          <FullScreenWrapper isFullScreen={survey}>
            <ButtonTask isSurvey={true} />
          </FullScreenWrapper>
        </div>
      ) : (
        <div className="w-full h-full overflow-hidden">
          <TaskHome
            taskName={data.title}
            taskMessage={data.taskMessage}
            handleStartGame={() => handleStartGame()}
          />
          <ButtonTask />
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

'use client';
import * as React from 'react';
import { useState } from 'react';
import { TasksConstant } from 'constants/tasks.constant';
import TaskHome from 'components/TaskHome';
import SynchronyTask from './SynchronyTask';
import SuspenseWrapper from 'components/SuspenseWrapper';
import { SynchronyStateProvider } from 'state/provider/SynchronyStateProvider';
import FullScreenWrapper from 'components/FullScreenWrapper';

const IndexPage = () => {
  const [survey, setSurvey] = useState<boolean>(false);
  const data = TasksConstant.SynchronyTask;

  const handleStartGame = () => {
    setSurvey(!survey);
  };

  return (
    <>
      {survey ? (
        <FullScreenWrapper isFullScreen={survey}>
          <SynchronyTask isSurvey={true} />
        </FullScreenWrapper>
      ) : (
        <div className="w-full h-full overflow-hidden">
          <TaskHome
            taskName={data.title}
            taskMessage={data.taskMessage}
            handleStartGame={() => handleStartGame()}
          />
          <SynchronyTask />
        </div>
      )}
    </>
  );
};

export default function Page() {
  return (
    <SuspenseWrapper>
      <SynchronyStateProvider>
        <IndexPage />
      </SynchronyStateProvider>
    </SuspenseWrapper>
  );
}

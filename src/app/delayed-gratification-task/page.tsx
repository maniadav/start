'use client';
import { useState } from 'react';
import { TasksConstant } from 'constants/tasks.constant';
import TaskHome from 'components/TaskHome';
import LanguageSamplingTask from './DelayedGratificationTask';
import SuspenseWrapper from 'components/SuspenseWrapper';
import DelayedGratificationTask from './DelayedGratificationTask';
import FullScreenWrapper from 'components/FullScreenWrapper';
const colors: string[] = ['red', 'green', 'blue', 'yellow', 'purple', 'orange'];

const IndexPage = () => {
  const [survey, setSurvey] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<any>(null);

  const data = TasksConstant.DelayedGratificationTask;

  const handleStartGame = () => {
    setSurvey(!survey);
    setStartTime(Date.now());
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
            taskName={data.title}
            taskMessage={data.taskMessage}
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

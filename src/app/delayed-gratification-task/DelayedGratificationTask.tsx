'use client';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import MessagePopup from 'components/common/MessagePopup';
import { timer } from '@utils/timer';
import { useSurveyContext } from 'state/provider/SurveytProvider';
import useWindowSize from '@hooks/useWindowSize';
import ProgressiveCircle from './ProgrgessiveCircle';
import Firework from './FireWork';
import CloseGesture from 'components/CloseGesture';

const DelayedGratificationTask = ({ isSurvey = false }) => {
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [circleCompStatus, setCircleCompStatus] = useState<boolean>(false);
  const [showFireWorks, setShowFireWorks] = useState<boolean>(false);
  const [alertShown, setAlertShown] = useState(false);
  const [timerData, setTimerData] = useState<{
    startTime: string;
    endTime: string;
    timeLimit: number;
    isTimeOver: boolean;
    timeTaken: number;
  } | null>(null);
  const [surveyData, setSurveyData] = useState<any>({});

  const { windowSize, deviceType } = useWindowSize();
  const { state, dispatch } = useSurveyContext();
  const searchParams = useSearchParams();
  const attemptString = searchParams.get('attempt') || '0';
  const attempt = parseInt(attemptString);
  const reAttemptUrl =
    attempt < 3 ? `delayed-gratification-task?attempt=${attempt + 1}` : null;
  const timeLimit = 180000;

  useEffect(() => {
    if (isSurvey) {
      handleStartGame();
    }
  }, [isSurvey]);

  useEffect(() => {
    if (timerData?.isTimeOver && !alertShown) {
      closeGame(timerData);
      setAlertShown(true);
    }
  }, [alertShown, timerData]);

  const handleStartGame = () => {
    handleTimer();
  };

  const stopTimerFuncRef = useRef<() => any>();

  const handleTimer = () => {
    const { endTimePromise, stopTimer } = timer(timeLimit);

    stopTimerFuncRef.current = stopTimer;

    endTimePromise.then(setTimerData);

    return () => {
      // Optional cleanup if necessary
      stopTimerFuncRef.current && stopTimerFuncRef.current();
    };
  };

  const handleStopTimer = useCallback(() => {
    if (stopTimerFuncRef.current) {
      const data = stopTimerFuncRef.current();
      return data;
    }
  }, []);

  const closeGame = useCallback(
    (timeData?: any, closedMidWay: boolean = false) => {
      console.log({ timeData });
      if (isSurvey) {
        setShowPopup(true);
        console.log({ timeData });
        setSurveyData((prevState: any) => {
          const updatedSurveyData = {
            ...prevState,
            timeTaken: timeData?.timeTaken || '',
            timeLimit: timeData?.timeLimit || '',
            endTime: timeData?.endTime || '',
            startTime: timeData?.startTime || '',
            closedWithTimeout: timeData?.isTimeOver || false,
            screenHeight: windowSize.height,
            screenWidth: windowSize.width,
            deviceType,
            closedMidWay,
          };

          dispatch({
            type: 'UPDATE_SURVEY_DATA',
            attempt,
            task: 'DelayedGratificationTask',
            data: updatedSurveyData,
          });

          return updatedSurveyData;
        });
      }
    },
    [isSurvey, timerData, attempt]
  );

  const handleCloseGame = () => {
    if (isSurvey) {
      setShowFireWorks(true);
      const timeData = handleStopTimer();

      // Add a 5-second delay for firework
      if (circleCompStatus) {
        setTimeout(() => {
          closeGame(timeData);
        }, 5000);
      } else {
        closeGame(timeData);
      }
    } else {
      alert('you may start the game!');
    }
  };

  const handleCloseMidWay = () => {
    const timeData = handleStopTimer();
    closeGame(timeData, true);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {isSurvey && <CloseGesture handlePressAction={handleCloseMidWay} />}
      {circleCompStatus && showFireWorks ? (
        <div className="w-screen h-screen relative bg-black">
          <video
            className="absolute top-0 left-0 w-full h-full object-fit"
            autoPlay
          >
            <source src="video/firework.mp4" type="video/mp4" />
          </video>
        </div>
      ) : (
        <div
          className="w-52 h-52 top-40 left-32 absolute cursor-pointer z-60"
          onClick={() => handleCloseGame()}
        >
          <Image
            width={600}
            height={600}
            src="/gif/star2.gif"
            objectFit="contain"
            alt="langaugesampling.png"
            className="border-b"
          />
        </div>
      )}

      <div className="top-1/2 relative w-full flex justify-center align-middle items-center gap-20">
        <div className="absolute">
          <ProgressiveCircle
            setCircleCompStatus={(e: boolean) => setCircleCompStatus(e)}
          />
        </div>
      </div>

      {isSurvey && (
        <MessagePopup
          showFilter={showPopup}
          msg={
            'You have completed the Delayed Gratification Task. You can now make another attempt for this test, go back to the survey dashboard or start the new task. '
          }
          testName={'delayed gratification'}
          reAttemptUrl={reAttemptUrl}
        />
      )}
    </div>
  );
};

export default DelayedGratificationTask;

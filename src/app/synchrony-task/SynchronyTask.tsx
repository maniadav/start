'use client';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect, useCallback, useRef } from 'react';
import MessagePopup from 'components/common/MessagePopup';
import { timer } from '@utils/timer';
import { useSurveyContext } from 'state/provider/SurveytProvider';
import useWindowSize from '@hooks/useWindowSize';
import DrumSVG from 'app/synchrony-task/DrumSVG';
import CloseGesture from 'components/CloseGesture';
import { useSynchronyStateContext } from 'state/provider/SynchronyStateProvider';
import useAudio from '@hooks/useAudio';

const SynchronyTask = ({ isSurvey = false }) => {
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [isGameAtive, setIsGameActive] = useState<boolean>(false);
  const [alertShown, setAlertShown] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [timerData, setTimerData] = useState<{
    startTime: string;
    endTime: string;
    timeLimit: number;
    isTimeOver: boolean;
  } | null>(null);
  const [surveyData, setSurveyData] = useState<any>({});
  const [drumClickTimes, setDrumClickTimes] = useState<string[]>([]);
  const { stickClick } = useSynchronyStateContext();
  const { windowSize, deviceType } = useWindowSize();
  const { state, dispatch } = useSurveyContext();
  const searchParams = useSearchParams();
  const attemptString = searchParams.get('attempt') || '0';
  const attempt = parseInt(attemptString);
  const reAttemptUrl =
    attempt < 3 ? `bubble-popping-task?attempt=${attempt + 1}` : null;
  const timeLimit = 300000;
  const bubblePop = useAudio('/audio/drum-hit.mp3');

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
    setStartTime(Date.now());
    setIsGameActive(true);
    handleTimer();
  };

  const stopTimerFuncRef = useRef<() => any>();

  const handleTimer = () => {
    const { endTimePromise, stopTimer } = timer(timeLimit);

    stopTimerFuncRef.current = stopTimer;

    endTimePromise.then(setTimerData);

    return () => {
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
    async (timeData?: any, closedMidWay: boolean = false) => {
      if (isSurvey) {
        setIsGameActive(false);
        setShowPopup(true);
        console.log({ timeData });
        setSurveyData((prevState: any) => {
          const updatedSurveyData = {
            ...prevState,
            timeTaken: timeData.timeTaken,
            timrLimit: timeData?.timeLimit || '',
            endTime: timeData?.endTime || '',
            startTime: timeData?.startTime || '',
            closedWithTimeout: timeData?.isTimeOver || false,
            screenHeight: windowSize.height,
            screenWidth: windowSize.width,
            drumPress: drumClickTimes,
            stickHit: stickClick,
            closedMidWay,
            deviceType,
          };

          dispatch({
            type: 'UPDATE_SURVEY_DATA',
            attempt,
            task: 'SynchronyTask',
            data: updatedSurveyData,
          });

          return updatedSurveyData;
        });
      }
    },
    [isSurvey, timerData, attempt, stickClick, drumClickTimes]
  );

  const handleCloseGame = (data: string) => {
    console.log(data);
    if (isSurvey) {
      const timeData = handleStopTimer();
      closeGame(timeData);
    } else {
      alert('you may start the game!');
    }
  };

  const [isClicked, setIsClicked] = useState(false);

  const handleDrumPress = () => {
    setIsClicked(true);
    bubblePop();
    const currTime = Date.now();
    const elapsedTimeInSeconds = ((currTime - startTime) / 1000).toFixed(2);
    setDrumClickTimes((prev) => [...prev, elapsedTimeInSeconds]);
  };

  useEffect(() => {
    if (isClicked) {
      const timer = setTimeout(() => {
        setIsClicked(false);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [isClicked]);

  const handleCloseMidWay = () => {
    const timeData = handleStopTimer();
    closeGame(timeData, true);
  };

  // useEffect(() => {
  //   let timeoutId: NodeJS.Timeout;

  //   const handleNoTouchDetected = () => {
  //     if (!drumClickTimes.length) {
  //       const timeData = handleStopTimer();
  //       closeGame(timeData, true);
  //     }
  //   };

  //   timeoutId = setTimeout(handleNoTouchDetected, 6000);

  //   return () => {
  //     clearTimeout(timeoutId);
  //   };
  // }, [startTime]);

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {isSurvey && <CloseGesture handlePressAction={handleCloseMidWay} />}
      <div className="relative w-full h-full flex flex-col justify-center items-center">
        <DrumSVG
          startTime={startTime}
          isSurvey={isSurvey}
          isGameActive={isGameAtive}
        />
        <div className="w-full px-12 absolute bottom-0">
          <div
            className={`w-full h-52 ${
              isClicked ? 'bg-yellow-300' : 'bg-gray-200'
            } highlight:bg-gray-300 border-[10px] border-gray-400 rounded-t-lg cursor-pointer focus:ring`}
            style={{ borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%' }}
            onClick={handleDrumPress}
          ></div>
        </div>
      </div>
      {isSurvey && (
        <MessagePopup
          showFilter={showPopup}
          msg={
            'You have completed the Language Sampling Task. You can now make another attempt for this test, go back to the survey dashboard or start the new task. '
          }
          testName={'language Sampling task'}
          reAttemptUrl={reAttemptUrl}
        />
      )}
    </div>
  );
};

export default SynchronyTask;

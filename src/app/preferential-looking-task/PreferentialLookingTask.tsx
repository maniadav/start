'use client';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect, useCallback, useRef } from 'react';
import MessagePopup from 'components/common/MessagePopup';
import { timer } from '@utils/timer';
import { useSurveyContext } from 'state/provider/SurveytProvider';
import useWindowSize from '@hooks/useWindowSize';
import CloseGesture from 'components/CloseGesture';
import WebGazer from '../gaze-training/WebGazer';
import { usePreferentialLookingStateContext } from 'state/provider/PreferentialLookingStateProvider';
import useVideoRecorder from '@hooks/useVideoRecorder';

const PreferentialLookingTask = ({ isSurvey = false }) => {
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [alertShown, setAlertShown] = useState(false);
  const [timerData, setTimerData] = useState<{
    startTime: string;
    endTime: string;
    timeLimit: number;
    isTimeOver: boolean;
  } | null>(null);
  const [surveyData, setSurveyData] = useState<any>({});
  const { windowSize, deviceType } = useWindowSize();
  const { state, dispatch } = useSurveyContext();
  const searchParams = useSearchParams();
  const attemptString = searchParams.get('attempt') || '0';
  const attempt = parseInt(attemptString);
  const reAttemptUrl =
    attempt < 3 ? `preferential-looking-task?attempt=${attempt + 1}` : null;
  const timeLimit = 180000;
  const { gazeData } = usePreferentialLookingStateContext();
  const { startVidRecording, stopVidRecording } = useVideoRecorder();

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
    startVidRecording();
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
    async (timeData?: any, closedMidWay: boolean = false) => {
      if (isSurvey) {
        const videoData = await stopVidRecording();
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
            closedMidWay,
            deviceType,
            gazeData,
            vide: videoData,
          };

          dispatch({
            type: 'UPDATE_SURVEY_DATA',
            attempt,
            task: 'PreferentialLookingTask',
            data: updatedSurveyData,
          });

          return updatedSurveyData;
        });
      }
    },
    [isSurvey, timerData, attempt]
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

  const handleCloseMidWay = () => {
    const timeData = handleStopTimer();
    closeGame(timeData, true);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {isSurvey && <CloseGesture handlePressAction={handleCloseMidWay} />}
      {/* <WebGazer isSurvey={isSurvey} /> */}
      <div className="w-screen h-screen relative bg-black">
        <video
          className="absolute top-0 left-0 w-full h-full object-fit"
          autoPlay
          muted
        >
          <source src="video/preferential.mp4" type="video/mp4" />
        </video>
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

export default PreferentialLookingTask;

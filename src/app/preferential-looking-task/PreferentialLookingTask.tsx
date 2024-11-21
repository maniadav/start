'use client';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect, useCallback, useRef } from 'react';
import MessagePopup from 'components/common/MessagePopup';
import { timer } from '@utils/timer';
import { useSurveyContext } from 'state/provider/SurveytProvider';
import useWindowSize from '@hooks/useWindowSize';
import CloseGesture from 'components/CloseGesture';
import { usePreferentialLookingStateContext } from 'state/provider/PreferentialLookingStateProvider';
import useVideoRecorder from '@hooks/useVideoRecorder';
import useEyeFeatureExtractor from '@hooks/useEyeFeatureExtractor';
import VidProcessingPopup from 'components/common/VidProcessingPopup';

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
  const { processVideo } = useEyeFeatureExtractor();

  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoDuration, setVideoDuration] = useState<number>(timeLimit);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      // Set up an event listener for when metadata is loaded
      videoElement.onloadedmetadata = () => {
        const durationInMilliseconds = videoElement.duration * 1000;
        setVideoDuration(durationInMilliseconds);
      };
    }

    return () => {
      if (videoElement) {
        videoElement.onloadedmetadata = null;
      }
    };
  }, []);

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
    const { endTimePromise, stopTimer } = timer(videoDuration);

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

        setShowPopup((prev) => {
          console.log('Current state:', prev);
          return !prev;
        });
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
            video: videoData,
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

    [isSurvey, timerData, attempt, showPopup]
  );

  const handleCloseMidWay = () => {
    const timeData = handleStopTimer();
    closeGame(timeData, true);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {isSurvey && <CloseGesture handlePressAction={handleCloseMidWay} />}
      <div className="w-screen h-screen relative bg-black">
        <video
          ref={videoRef}
          className="absolute top-0 left-0 w-full h-full object-fit"
          autoPlay
          muted
        >
          <source src="video/preferential.mp4" type="video/mp4" />
        </video>
      </div>

      {isSurvey && (
        <VidProcessingPopup
          showFilter={showPopup}
          onProcessComplete={setShowPopup}
          reAttemptUrl={reAttemptUrl}
        />
      )}
    </div>
  );
};

export default PreferentialLookingTask;

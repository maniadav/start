import useAudio from '@hooks/useAudio';
import React, { useEffect, useState } from 'react';
import { useSynchronyStateContext } from 'state/provider/SynchronyStateProvider';

interface DrumInterface {
  startTime: number;
  isSurvey: boolean;
  isGameActive: boolean;
}

const DrumPatch = ({ startTime, isSurvey, isGameActive }: DrumInterface) => {
  const [isClicked, setIsClicked] = useState(false);
  const { setDrumClicks } = useSynchronyStateContext();
  const drumHit = useAudio('/audio/drum-hit.mp3');

  useEffect(() => {
    if (isClicked) {
      const timer = setTimeout(() => {
        setIsClicked(false);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [isClicked]);

  const handleDrumPress = () => {
    setIsClicked(true);
    drumHit();
    const currTime = Date.now();
    const elapsedTimeInSeconds = parseFloat(
      ((currTime - startTime) / 1000).toFixed(2)
    );
    if (isSurvey && isGameActive) {
      setDrumClicks((prev: number[]) => [...prev, elapsedTimeInSeconds]);
    }
  };

  return (
    <div
      className={`w-full h-52 ${
        isClicked ? 'bg-yellow-300' : 'bg-gray-200'
      } highlight:bg-gray-300 border-[10px] border-gray-400 rounded-t-lg cursor-pointer focus:ring`}
      style={{ borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%' }}
      onClick={handleDrumPress}
    ></div>
  );
};

export default DrumPatch;

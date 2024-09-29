import { useEffect, useState } from 'react';

const useAudio = (src: string) => {
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && src) {
      const audioInstance = new Audio(src);
      audioInstance.preload = 'auto'; // preload the audio to avoid delay
      setAudio(audioInstance);
    }

    return () => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
        audio.src = '';
      }
    };
  }, [src]);

  const play = async () => {
    if (audio) {
      try {
        await audio.play();
      } catch (error) {
        console.error('Failed to play the audio:', error);
      }
    }
  };

  return play;
};

export default useAudio;

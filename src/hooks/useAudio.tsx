import { useEffect, useState } from "react";

const useAudio = (src: string) => {
  const [audio, setAudio] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const audioInstance = new Audio(src);
      setAudio(audioInstance);
    }
  }, [src]);

  const play = () => {
    if (audio) {
      audio.play();
    }
  };

  return play;
};

export default useAudio;

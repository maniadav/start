import { BASE_URL } from "@constants/config.constant";

export const getRandomVideo = () => {
  const useFirstRange = Math.random() < 0.5;
  let red;
  let blue;

  const videos = [
    { video: `${BASE_URL}/video/girl.mp4`, key: "social" },
    { video: `${BASE_URL}/video/pattern.mp4`, key: "nonsocial" },
  ];
  if (useFirstRange) {
    red = videos[0];
    blue = videos[1];
  } else {
    red = videos[1];
    blue = videos[0];
  }

  return {
    red,
    blue,
  };
};

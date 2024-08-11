import { numberToStringDate } from "@helper/convert";

// utils/timer.ts
export interface TimerData {
  startTime: number;
  endTime: number;
  timeLimit: number;
  isTimeOver: boolean;
  timeTaken: number;
}

export const timer = (timeLimit: number) => {
  const startTime = Date.now();
  const startTimeIST = numberToStringDate(startTime);

  let timeoutId: NodeJS.Timeout;

  const endTimePromise = new Promise<number>((resolve) => {
    timeoutId = setTimeout(() => {
      resolve(Date.now());
    }, timeLimit);
  });

  const stopTimer = () => {
    clearTimeout(timeoutId);
    const endTimeNumber = Date.now();
    const timeTaken = endTimeNumber - startTime;
    const isTimeOver = timeTaken >= timeLimit;
    const endTime = numberToStringDate(endTimeNumber);
    return {
      startTime: startTimeIST,
      endTime,
      timeLimit,
      isTimeOver,
      timeTaken,
    };
  };

  return {
    endTimePromise: endTimePromise.then((end) => {
      const timeTaken = end - startTime;
      const isTimeOver = timeTaken >= timeLimit;
      const endIST = numberToStringDate(end);
      return {
        startTime: startTimeIST,
        endTime: endIST,
        timeLimit,
        isTimeOver,
        timeTaken,
      };
    }),
    stopTimer,
  };
};

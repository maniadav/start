// utils/timer.ts
export interface TimerData {
  startTime: number;
  endTime: number;
  timeLimit: number;
  isTimeOver: boolean;
}

export const timer = (timeLimit: number) => {
  const startTime = Date.now();

  let timeoutId: NodeJS.Timeout;

  const endTimePromise = new Promise<number>((resolve) => {
    timeoutId = setTimeout(() => {
      resolve(Date.now());
    }, timeLimit);
  });

  const stopTimer = () => {
    clearTimeout(timeoutId);
    const endTime = Date.now();
    const isTimeOver = endTime - startTime >= timeLimit;
    return { startTime, endTime, timeLimit, isTimeOver };
  };

  const setIST = (dateUTC: { getTime: () => number; getTimezoneOffset: () => number; }) => {
    const utc = dateUTC.getTime() + (dateUTC.getTimezoneOffset() * 60000);
    const newDate = new Date(utc + (3600000 * +5.5));
    var ist = newDate.toLocaleString();
    return ist
  }
  return {
    endTimePromise: endTimePromise.then((end) => {
      const isTimeOver = end - startTime >= timeLimit;
      return {
        startTime,
        endTime: end,
        timeLimit,
        isTimeOver,
      };
    }),
    stopTimer,
  };
};

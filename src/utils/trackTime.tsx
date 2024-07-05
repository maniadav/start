let startTime: Date | null = null;

export function trackTaskTime(action: "start" | "end") {
  const timeZone = "Asia/Kolkata";

//   function formatTime(date: Date) {
//     const zonedDate = utcToZonedTime(date, timeZone);
//     return formatTz(zonedDate, "yyyy-MM-dd HH:mm:ssXXX", { timeZone });
//   }

  if (action === "start") {
    startTime = new Date();
    return null;
  } else if (action === "end") {
    if (startTime) {
      const endTime = new Date();
      const diffMs = endTime.getTime() - startTime.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffSecs = ((diffMs % 60000) / 1000).toFixed(0);
      const timeTaken = `${diffMins} minutes and ${diffSecs} seconds`;

      //   const timeStart = formatTime(startTime);
      //   const timeEnd = formatTime(endTime);

      return {
        startTime,
        endTime,
        timeTaken: timeTaken,
      };
    }
  }
  return null;
}

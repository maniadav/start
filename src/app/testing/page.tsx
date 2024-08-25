import React from "react";
import TimerComponent from "./TimerComponent";
import TouchPressureComponent from "app/bubble-popping-task/TouchPressure";

const page = () => {
  return (
    <div className="w-screen h-screen">
      <TouchPressureComponent />
    </div>
  );
};

export default page;

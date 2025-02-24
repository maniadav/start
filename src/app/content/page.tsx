// pages/index.js
import React from "react";
import SurveyDataType from "./SurveyDataType";

const HomePage = () => {
  const sampleData = {
    assestment_id: "MotorFollowingTask",
    noOfAttempt: 2,
    attempt1_timeTaken: "120",
    attempt1_timeLimit: "180",
    attempt1_startTime: "2023-01-01T10:00:00Z",
    attempt1_endTime: "2023-01-01T10:02:00Z",
    attempt1_closedWithTimeout: false,
    attempt1_closedMidway: false,
    attempt1_screenHeight: "1920",
    attempt1_screenWidth: "1080",
    attempt1_deviceType: "Mobile",
    attempt1_touchX: "100",
    attempt1_touchY: "200",
    attempt1_objX: "150",
    attempt1_objY: "250",
    userID: "12345",
    userDOB: "1990-01-01",
    userGender: "Male",
    // Add more data as needed
  };

  return (
    <div className="container mx-auto px-4 text-black">
      <h1 className="text-2xl font-bold my-4">Assessment Data Display</h1>
      <SurveyDataType data={sampleData} />
    </div>
  );
};

export default HomePage;

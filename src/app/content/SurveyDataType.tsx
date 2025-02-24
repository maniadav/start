// components/AssessmentDisplay.js
import React from "react";

const SurveyDataType = ({ data }: any) => {
  const renderAttemptData = (attemptNumber: any) => {
    const attemptPrefix = `attempt${attemptNumber}_`;
    return (
      <div key={attemptNumber} className="mb-4 p-4 border rounded-lg shadow-sm">
        <h3 className="font-semibold">Attempt {attemptNumber}</h3>
        <p>Time Taken: {data[`${attemptPrefix}timeTaken`]}</p>
        <p>Time Limit: {data[`${attemptPrefix}timeLimit`]}</p>
        <p>
          Start Time:{" "}
          {new Date(data[`${attemptPrefix}startTime`]).toLocaleString()}
        </p>
        <p>
          End Time: {new Date(data[`${attemptPrefix}endTime`]).toLocaleString()}
        </p>
        <p>
          Closed with Timeout:{" "}
          {data[`${attemptPrefix}closedWithTimeout`] ? "Yes" : "No"}
        </p>
        <p>
          Closed Midway: {data[`${attemptPrefix}closedMidway`] ? "Yes" : "No"}
        </p>
        <p>Screen Height: {data[`${attemptPrefix}screenHeight`]}</p>
        <p>Screen Width: {data[`${attemptPrefix}screenWidth`]}</p>
        <p>Device Type: {data[`${attemptPrefix}deviceType`]}</p>
        {/* Assessment Specific Data */}
        {data.assestment_id === "MotorFollowingTask" && (
          <>
            <p>Touch X: {data[`${attemptPrefix}touchX`]}</p>
            <p>Touch Y: {data[`${attemptPrefix}touchY`]}</p>
            <p>Object X: {data[`${attemptPrefix}objX`]}</p>
            <p>Object Y: {data[`${attemptPrefix}objY`]}</p>
          </>
        )}
        {/* Add other assessment types similarly */}
      </div>
    );
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">
        Assessment ID: {data.assestment_id}
      </h2>
      <p>User ID: {data.userID}</p>
      <p>User DOB: {data.userDOB}</p>
      <p>User Gender: {data.userGender}</p>
      <div className="mt-4">
        {[...Array(data.noOfAttempt)].map((_, i) => renderAttemptData(i + 1))}
      </div>
    </div>
  );
};

export default SurveyDataType;

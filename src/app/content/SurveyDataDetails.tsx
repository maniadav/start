import React from "react";

const commonDataMetrics = [
  { key: "assessment_id", description: "Unique id for the assessment type" },
  { key: "noOfAttempt", description: "Number of attempts made (max 3)" },
  {
    key: "attempt<attempt_number>_timeTaken",
    description: "Time taken for the attempt",
  },
  {
    key: "attempt<attempt_number>_timeLimit",
    description: "Max time limit for the attempt",
  },
  {
    key: "attempt<attempt_number>_startTime",
    description: "Start time for the attempt (Date with time)",
  },
  {
    key: "attempt<attempt_number>_endTime",
    description: "End time for the attempt (Date with time)",
  },
  {
    key: "attempt<attempt_number>_closedWithTimeout",
    description: "Indicates if the attempt closed due to timeout (Boolean)",
  },
  {
    key: "attempt<attempt_number>_closedMidWay",
    description: "Indicates if the attempt was closed midway (Boolean)",
  },
  {
    key: "attempt<attempt_number>_screenHeight",
    description: "Device Screen height in pixels",
  },
  {
    key: "attempt<attempt_number>_screenWidth",
    description: "Device Screen width in pixels",
  },
  { key: "attempt<attempt_number>_deviceType", description: "Device Type" },
  { key: "userID", description: "Unique identifier for the user" },
  { key: "userDOB", description: "Date of birth of the user" },
  { key: "userGender", description: "Gender of the user" },
];

const motorFollowingTaskMetrics = [
  {
    key: " assessment_id                  | ",
    description: "MotorFollowingTask`",
  },
  {
    key: "attempt<attempt_number>_touchX",
    description: "X coordinate of touch input",
  },
  {
    key: "attempt<attempt_number>_touchY",
    description: "Y coordinate of touch input",
  },
  {
    key: "attempt<attempt_number>_objX",
    description: "X coordinate of object",
  },
  {
    key: "attempt<attempt_number>_objY",
    description: "Y coordinate of object",
  },
];

const bubblePoppingTaskMetrics = [
  {
    key: " assessment_id                         ",
    description: "BubblePoppingTask",
  },
  {
    key: "attempt<attempt_number>_ballCoord",
    description: "Coordinates of the ball center at the time of pop",
  },
  {
    key: "attempt<attempt_number>_mouseCoord",
    description: "Coordinates of the touch pointer",
  },
  {
    key: "attempt<attempt_number>_colors",
    description: "Colors of the bubbles popped",
  },
  {
    key: "attempt<attempt_number>_bubblesPopped",
    description: "Number of bubbles popped",
  },
  {
    key: "attempt<attempt_number>_bubblesTotal",
    description: "Total number of bubbles (6 by default)",
  },
];

const buttonTaskMetrics = [
  {
    key: " assessment_id                             ",
    description: "ButtonTask",
  },
  {
    key: "attempt<attempt_number>_buttonClickedData",
    description: "Type of button clicked (red or blue)",
  },
  {
    key: "attempt<attempt_number>_redButton",
    description: "Video type linked with red button (social or nonsocial)",
  },
  {
    key: "attempt<attempt_number>_blueButton",
    description: "Video type linked with blue button (social or nonsocial)",
  },
];

const wheelTaskMetrics = [
  { key: " assessment_id                        ", description: "WheelTask" },
  {
    key: "attempt<attempt_number>_gazeDistance",
    description: "Distance of user from the device",
  },
  {
    key: "attempt<attempt_number>_gazeTiming",
    description: "Timing of gaze distance",
  },
];

const synchronyTaskMetrics = [
  { key: " assessment_id                     ", description: "SynchronyTask" },
  {
    key: "attempt<attempt_number>_drumPress",
    description: "Timing when user presses the drum",
  },
  {
    key: "attempt<attempt_number>_stickHit",
    description: "Timing when stick hits the drum",
  },
];

const delayedGratificationTaskMetrics = [
  { key: " assessment_id ", description: "DelayedGratificationTask" },
];

const preferentialLookingTaskMetrics = [
  {
    key: " assessment_id                         ",
    description: "PreferentialLookingTask",
  },
  {
    key: "attempt<attempt_number>_gazeTiming",
    description: "Timing of gaze movements (in sec with two decimal points)",
  },
  {
    key: "attempt<attempt_number>_gazeDirection",
    description: "Direction of gaze movement (left or right)",
  },
  {
    key: "attempt<attempt_number>_gazeVidType",
    description: "Type of video used for gaze tracking (social or non-social)",
  },
];

const SurveyDataDetails = () => {
  return (
    <div className="max-w-[1200px] container p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">App Data Format</h1>
      <p className="mb-6 text-gray-700">
        The data collected for each task includes 3 attempts per assessment.
        Each assessment has a unique{" "}
        <code className="bg-gray-200 px-1">assessment_id</code>, and a maximum
        of three attempts (<code className="bg-gray-200 px-1">noOfAttempt</code>{" "}
        ≤ 3) is allowed.
      </p>

      <h2 className="text-2xl font-semibold mt-4">Common Data Metrics</h2>
      <div className="overflow-x-auto mt-2">
        <table className="w-full border border-gray-300 bg-white">
          <thead>
            <tr className="bg-gray-300">
              <th className="p-2 text-left">Column Name</th>
              <th className="p-2 text-left">Description</th>
            </tr>
          </thead>
          <tbody>
            {commonDataMetrics.map((metric, index) => (
              <tr key={index} className="border-b border-gray-200">
                <td className="p-2 font-mono text-blue-700">{metric.key}</td>
                <td className="p-2 text-gray-700">{metric.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {[
        { title: "Motor Following Task", data: motorFollowingTaskMetrics },
        { title: "Bubble Popping Task", data: bubblePoppingTaskMetrics },
        { title: "Button Task", data: buttonTaskMetrics },
        { title: "Wheel Task", data: wheelTaskMetrics },
        { title: "Synchrony Task", data: synchronyTaskMetrics },
        {
          title: "Delayed Gratification Task",
          data: delayedGratificationTaskMetrics,
        },
        {
          title: "Preferential Looking Task",
          data: preferentialLookingTaskMetrics,
        },
      ].map((task, index) => (
        <div key={index}>
          <h2 className="text-2xl font-semibold mt-6">{task.title}</h2>
          <div className="overflow-x-auto mt-2">
            <table className="w-full border border-gray-300 bg-white">
              <thead>
                <tr className="bg-gray-300">
                  <th className="p-2 text-left">Column Name</th>
                  <th className="p-2 text-left">Description</th>
                </tr>
              </thead>
              <tbody>
                {task.data.length > 0 ? (
                  task.data.map((metric, index) => (
                    <tr key={index} className="border-b border-gray-200">
                      <td className="p-2 font-mono text-blue-700">
                        {metric.key}
                      </td>
                      <td className="p-2 text-gray-700">
                        {metric.description}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="p-2" colSpan={2}>
                      No specific metrics
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SurveyDataDetails;

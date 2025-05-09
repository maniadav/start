type BlendShapeData = {
  [key: string]: number;
};

/*
eyeLookInLeft: how much the left eye is looking inward.
eyeLookOutLeft: how much the left eye is looking outward.
eyeLookInRight: how much the right eye is looking inward.
eyeLookOutRight: how much the right eye is looking outward.

The gaze direction is determined by comparing the values of these blend shape scores.
- "Right" gaze is when the right eye is looking inward, and the left eye is looking outward.
- "Left" gaze is when the left eye is looking inward, and the right eye is looking outward.
- "Center" gaze occurs when the difference between inward and outward scores for both eyes is minimal (under a defined threshold).
- "Uncertain" is returned for cases where the gaze cannot be determined.
- "No eye detected" is returned when any blend shape data is missing.

logic assume that:
- Higher scores for `eyeLookIn` suggest the eye is looking inward (towards the nose).
- Higher scores for `eyeLookOut` suggest the eye is looking outward (towards the ear).
*/

export const determineGazeDirection = (data: BlendShapeData) => {
  const { eyeLookInLeft, eyeLookInRight, eyeLookOutLeft, eyeLookOutRight } =
    data;

  if (
    eyeLookInLeft === undefined ||
    eyeLookInRight === undefined ||
    eyeLookOutLeft === undefined ||
    eyeLookOutRight === undefined
  ) {
    return "No eye detected";
  }
  // console.log(
  //   {
  //     eyeLookInLeft,
  //     eyeLookInRight,
  //     eyeLookOutLeft,
  //     eyeLookOutRight,
  //   },
  //   eyeLookInRight > eyeLookInLeft,
  //   eyeLookOutLeft > eyeLookOutRight,
  //   eyeLookInRight > eyeLookInLeft && eyeLookOutLeft > eyeLookOutRight,
  //   eyeLookInLeft > eyeLookInRight && eyeLookOutRight > eyeLookOutLeft
  // );
  const centerThreshold = 0.2;

  if (eyeLookInRight > eyeLookInLeft && eyeLookOutLeft > eyeLookOutRight) {
    return "Right";
  } else if (
    eyeLookInLeft > eyeLookInRight &&
    eyeLookOutRight > eyeLookOutLeft
  ) {
    return "Left";
  } else if (
    Math.abs(eyeLookInLeft - eyeLookInRight) < centerThreshold &&
    Math.abs(eyeLookOutLeft - eyeLookOutRight) < centerThreshold
  ) {
    return "Left";
  } else {
    return "Uncertain";
  }
};

// DEPTH ANALYSIS

type Landmark = { x: number; y: number; z: number };

type DepthEstimationParams = {
  leftEye: Landmark;
  rightEye: Landmark;
};

export function getGazeDirection(landmarks: any) {
  // check public/model/mediapipe/mediapipe_face_landmark_fullsize.png
  if (
    // Point 468: Left eye iris
    !landmarks?.[468] ||
    // Point 473: Right eye iris
    !landmarks?.[473] ||
    // Point 33: Left eye outer corner (face mesh)
    !landmarks?.[33] ||
    // Point 263: Right eye outer corner (face mesh)
    !landmarks?.[263]
  ) {
    return "Invalid landmarks";
  }

  // Extract coordinates
  const leftIris = landmarks[468]; // Left iris center
  const rightIris = landmarks[473]; // Right iris center
  const leftEyeCorner = landmarks[33]; // Left corner of the left eye
  const rightEyeCorner = landmarks[263]; // Right corner of the right eye

  // Helper function to calculate Euclidean distance
  function euclideanDistance(
    point1: { x: number; y: number },
    point2: { x: number; y: number }
  ) {
    const dx = point1.x - point2.x;
    const dy = point1.y - point2.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  // Calculate distances
  const leftDistance = euclideanDistance(leftIris, leftEyeCorner);
  const rightDistance = euclideanDistance(rightIris, rightEyeCorner);

  // Determine gaze direction
  if (leftDistance > rightDistance) {
    return "left"; // right wrt screen
  } else if (rightDistance > leftDistance) {
    return "right"; // left wrt screen
  } else {
    return "center"; // Face is looking straight
  }
}

// distance of user from screen is estimated using the distance between eyes in each frame.
export const calculateDepth = (landmarks: any) => {
  // check mediapipe_face_landmark_fullsize in public/model

  // calculate percieved depth
  if (!landmarks?.[33] || !landmarks?.[263]) {
    return 0;
  }

  const leftEye = landmarks?.[33]; // coordinates of left corner of left eye
  const rightEye = landmarks?.[263]; // coordinates of right corner of right eye

  const perceivedWidth = Math.sqrt(
    Math.pow(leftEye.x - rightEye.x, 2) + Math.pow(leftEye.y - rightEye.y, 2)
  );

  return perceivedWidth; // distance in cm
};

const downloadJSON = (data: any[], filename: string) => {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

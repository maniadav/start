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
    return 'No eye detected';
  }

  const centerThreshold = 0.2;

  if (eyeLookInRight > eyeLookInLeft && eyeLookOutLeft > eyeLookOutRight) {
    return 'Right';
  } else if (
    eyeLookInLeft > eyeLookInRight &&
    eyeLookOutRight > eyeLookOutLeft
  ) {
    return 'Left';
  } else if (
    Math.abs(eyeLookInLeft - eyeLookInRight) < centerThreshold &&
    Math.abs(eyeLookOutLeft - eyeLookOutRight) < centerThreshold
  ) {
    return 'Center';
  } else {
    return 'Uncertain';
  }
};

// DEPTH ANALYSIS

type Landmark = { x: number; y: number; z: number };

type DepthEstimationParams = {
  leftEye: Landmark;
  rightEye: Landmark;
  realFaceWidth: number; // in cm
  focalLength: number; // in pixels
};

// calculate depth
export const calculateDepth = ({
  leftEye,
  rightEye,
  realFaceWidth,
  focalLength,
}: DepthEstimationParams): number => {
  if (!leftEye || !rightEye) {
    throw new Error('Missing eye landmarks for depth estimation');
  }

  // Calculate perceived width (distance between eyes in pixels)
  const perceivedWidth = Math.sqrt(
    Math.pow(leftEye.x - rightEye.x, 2) + Math.pow(leftEye.y - rightEye.y, 2)
  );

  if (perceivedWidth === 0) {
    console.log('Invalid perceived width, cannot calculate depth');
    return 0;
  }

  // depth (distance from the camera)
  const distanceInCm = (realFaceWidth * focalLength) / perceivedWidth;

  return distanceInCm; // distance in cm
};

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

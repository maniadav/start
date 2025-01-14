## GAZE CLASSIFICATION RIGHT/LEFT

---


## GAZE DEPTH ESTIMATION

---

### Key Points of the Code:

1. **Inputs** :

* `leftEye`: Coordinates of the left eye landmark.
* `rightEye`: Coordinates of the right eye landmark.
* These landmarks are expected to have `x` and `y` properties.

1. **Validation** :

* If either of the eye landmarks is missing, the function returns `0`.

1. **Assumptions** :

* **Real Face Width (`realFaceWidth`)** : The average distance between the centers of the eyes is assumed to be 14 cm (commonly used for adults).
* **Focal Length (`focalLength`)** : The camera's focal length in pixels is set to an estimated/calibrated value of `500`.

1. **Distance Between Eyes (Perceived Width)** :

* Uses the Euclidean distance formula to calculate the distance between the eyes in pixels:
  perceivedWidth=(x2−x1)2+(y2−y1)2\text{perceivedWidth} = \sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}
* This is the perceived width in the image captured by the camera.

1. **Depth Calculation** :

* The depth (distance from the camera) is calculated using the  **similar triangles method** :
  distanceInCm=realFaceWidth×focalLengthperceivedWidth\text{distanceInCm} = \frac{\text{realFaceWidth} \times \text{focalLength}}{\text{perceivedWidth}}
* This uses the known real-world distance between the eyes and the perceived width in the image to infer the distance.

1. **Return** :

* Returns the distance in centimeters.

---

### Landmarks for Accurate Eye Detection:

For accurate depth estimation, use the  **central point of each eye** . MediaPipe's Face Mesh provides multiple points around the eyes, and you can use the following coordinates for better accuracy:

* **Left Eye** : Average of landmarks around the left eye (e.g., 33, 133, 159, 145 for MediaPipe Face Mesh).
* **Right Eye** : Average of landmarks around the right eye (e.g., 362, 263, 387, 374 for MediaPipe Face Mesh).

To compute the center:

```javascript
const calculateEyeCenter = (landmarks) => {
  const x = landmarks.reduce((sum, point) => sum + point.x, 0) / landmarks.length;
  const y = landmarks.reduce((sum, point) => sum + point.y, 0) / landmarks.length;
  return { x, y };
};

// Example usage:
const leftEyeCenter = calculateEyeCenter([landmark33, landmark133, landmark159, landmark145]);
const rightEyeCenter = calculateEyeCenter([landmark362, landmark263, landmark387, landmark374]);
```

These coordinates represent the approximate center of the left and right eyes.

---

### Why This Works:

* The relationship between the real-world width of the face and its perceived width in pixels is proportional to the distance from the camera. By maintaining the known ratio (`real width : perceived width`), the formula infers the distance.

---

### Limitations:

1. **Focal Length** : The focal length depends on the camera and should ideally be calibrated for accurate results.
2. **Real Face Width** : This assumes a standard face width, which might not apply to all individuals.
3. **Perspective Distortion** : If the face is not directly facing the camera or is at an angle, the perceived width may be inaccurate.

To address these, ensure proper calibration and positioning of the face relative to the camera.

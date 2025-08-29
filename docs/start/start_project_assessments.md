# START Project Assessments

This document provides detailed information about the various assessments available in the START platform.

## Assessment Overview

The START platform includes several interactive tasks designed to assess different aspects of child development:

1. Motor Following Task
2. Bubble Popping Task
3. Button Task
4. Wheel Task
5. Synchrony Task
6. Delayed Gratification Task
7. Preferential Looking Task

## Assessment Structure

Each assessment follows these key principles:
- Allows up to 3 attempts per assessment
- Has a default time limit of 3 minutes per attempt
- Generates comprehensive data in CSV format
- Includes both common and task-specific metrics

## Common Data Structure

Every assessment captures the following base metrics:

| Field | Description |
|-------|-------------|
| `assessment_id` | Unique identifier for the assessment type |
| `noOfAttempt` | Number of attempts made (max 3) |
| `attempt{n}_timeTaken` | Duration of the attempt |
| `attempt{n}_timeLimit` | Maximum time allowed |
| `attempt{n}_startTime` | Start timestamp |
| `attempt{n}_endTime` | End timestamp |
| `attempt{n}_closedWithTimeout` | Whether attempt ended due to timeout |
| `attempt{n}_closedMidWay` | Whether attempt was terminated early |
| `attempt{n}_screenHeight` | Device screen height (pixels) |
| `attempt{n}_screenWidth` | Device screen width (pixels) |
| `attempt{n}_deviceType` | Type of device used |
| `userId` | Unique user identifier |
| `userDob` | User's date of birth |
| `userGender` | User's gender |

## Task-Specific Metrics

### 1. Motor Following Task
**Assessment ID**: `MotorFollowingTask`

Tracks:
- Touch coordinates (X,Y)
- Object coordinates (X,Y)

### 2. Bubble Popping Task
**Assessment ID**: `BubblePoppingTask`

Captures:
- Ball coordinates at pop time (x-y format)
- Mouse/touch pointer coordinates
- Bubble colors
- Number of bubbles popped
- Total bubbles (default: 6)

### 3. Button Task
**Assessment ID**: `ButtonTask`

Records:
- Button click data (red/blue)
- Video type associations (social/nonsocial)

### 4. Wheel Task
**Assessment ID**: `WheelTask`

Measures:
- User's gaze distance from device
- Gaze timing data

### 5. Synchrony Task
**Assessment ID**: `SynchronyTask`

Tracks:
- Drum press timing
- Stick hit timing

### 6. Delayed Gratification Task
**Assessment ID**: `DelayedGratificationTask`

Basic assessment with standard metrics.

### 7. Preferential Looking Task
**Assessment ID**: `PreferentialLookingTask`

Measures:
- Gaze timing (seconds, 2 decimal precision)
- Gaze direction (left/right)
- Video type used (social/nonsocial)

## Data Export Format

All assessment data is exported in CSV format with:
- Separate columns for each attempt
- Consistent naming conventions
- Timestamp precision
- Boolean flags for completion status

## Notes

- Attempt numbers are represented as `attempt1_`, `attempt2_`, and `attempt3_` in data fields
- All timestamps include both date and time
- Screen measurements are recorded in pixels
- Video types are categorized as either 'social' or 'nonsocial'
- Coordinate data is stored in pixel-based measurements

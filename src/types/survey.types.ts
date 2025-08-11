// types.ts

export interface Attempt {
  closedWithTimeout: boolean;
  timeTaken: string;
  bubbleX: number[];
  bubbleY: number[];
  mouseX: number[];
  mouseY: number[];
  colors: string[];
  bubblesPopped: string;
  bubblesTotal: string;
  startTime: string;
  endTime: string;
  screenHeight: string;
  screenWidth: string;
  deviceType: string;
}

export interface BubblePoppingType {
  assessment_id: string;
  noOfAttempt: number;
  attempt1: Partial<Attempt>;
  attempt2: Partial<Attempt>;
  attempt3: Partial<Attempt>;
  useID: string;
  surveyID: string;
}

export interface MotorFollowingType {
  assessment_id: string;
  noOfAttempt: number;
  attempt1: Partial<Attempt>;
  attempt2: Partial<Attempt>;
  attempt3: Partial<Attempt>;
  useID: string;
  surveyID: string;
}

export interface Coordinate {
  x: number;
  y: number;
}

// common data in each survey
export interface SurveyDataType {
  assessmentID: string;
  noOfAttempt: number;
  userId: string;
  userDob: string;
  userGender: string;
  observerId: string;
  attempt1: Partial<SurveyAttemptDataType>;
  attempt2: Partial<SurveyAttemptDataType>;
  attempt3: Partial<SurveyAttemptDataType>;
}

export interface SurveyAttemptDataType {
  timeTaken: string;
  timeLimit: string;
  endTime: string;
  startTime: string;
  closedWithTimeout: boolean;
  screenHeight: string;
  screenWidth: string;
  deviceType: string;
  closedMidWay: boolean;
}

//SURVEY RELATED SPECIFIC DATA TYPES in addion to the common data types
// delayed gratification survey data
export interface DGTAttemptDataType extends SurveyAttemptDataType {}

export interface TimerDataType {
  startTime: string;
  endTime: string;
  timeLimit: number;
  isTimeOver: boolean;
  timeTaken: number;
}

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
  assestment_id: string;
  noOfAttempt: number;
  attempt1: Partial<Attempt>;
  attempt2: Partial<Attempt>;
  attempt3: Partial<Attempt>;
  useID: string;
  surveyID: string;
}

export interface MotorFollowingType {
  assestment_id: string;
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

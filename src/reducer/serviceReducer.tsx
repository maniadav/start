// reducers/surveyReducer.ts
export interface SurveyAttempt {
  closedWithTimeout?: boolean;
  timeTaken?: string;
  ballCoord?: string[];
  mouseCoord?: string[];
  colors?: string[];
  bubblesPopped?: string;
  bubblesTotal?: string;
  startTime?: string;
  endTime?: string;
  screenHeight?: string;
  screenWidth?: string;
  deviceType?: string;
}

export interface SurveyState {
  BubblePoppingTask: any;
  MotorFollowingTask: any;
  [key: string]: any;
}

export type Action =
  | { type: "SET_SURVEY_DATA"; payload: Partial<SurveyState> }
  | {
      type: "UPDATE_SURVEY_DATA";
      attempt: number;
      task: string;
      data: SurveyAttempt;
    };

export const surveyReducer = (state: SurveyState, action: Action): any => {
  // console.log("pinned dispatched", action);
  switch (action.type) {
    case "SET_SURVEY_DATA":
      return { ...state, ...action.payload };

    case "UPDATE_SURVEY_DATA":
      return {
        ...state,
        [action.task]: {
          ...state[action.task],
          noOfAttempt: action.attempt,
          [`attempt${action.attempt}`]: {
            ...state[action.task][`attempt${action.attempt}`],
            ...action.data,
          },
        },
      };
    default:
      return { ...state };
  }
};

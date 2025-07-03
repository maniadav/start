import { getInitialSurveyState } from "@constants/survey.data.constant";

// reducers/SurveyReducer.ts
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
    }
  | { type: "RESET_SURVEY_DATA" };

export const SurveyReducer = (state: SurveyState, action: Action): any => {
  switch (action.type) {
    case "SET_SURVEY_DATA":
      return { ...state, ...action.payload };

    case "UPDATE_SURVEY_DATA":
      console.log("action.attempt", action.attempt);
      return {
        ...state,
        [action.task]: {
          ...state[action.task],
          noOfAttempt: action?.attempt,
          [`attempt${action.attempt}`]: {
            ...state[action.task]?.[`attempt${action?.attempt}`],
            ...action.data,
          },
        },
      };
    case "RESET_SURVEY_DATA":
      return getInitialSurveyState();
    default:
      return { ...state };
  }
};

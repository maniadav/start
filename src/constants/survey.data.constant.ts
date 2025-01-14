import PreferentialLookingStateContext from 'state/context/PreferentialLookingStateContext';
import { BubblePoppingType, MotorFollowingType } from 'types/survey.types';

export const BubblePoppingData: BubblePoppingType = {
  assestment_id: 'BubblePoppingTask',
  noOfAttempt: 0,
  attempt1: {},
  attempt2: {},
  attempt3: {},
  useID: '',
  surveyID: '',
};
export const MotorFollowingData: MotorFollowingType = {
  assestment_id: 'MotorFollowingTask',
  noOfAttempt: 0,
  attempt1: {},
  attempt2: {},
  attempt3: {},
  useID: '',
  surveyID: '',
};
export const ButtonTaskData: MotorFollowingType = {
  assestment_id: 'ButtonTask',
  noOfAttempt: 0,
  attempt1: {},
  attempt2: {},
  attempt3: {},
  useID: '',
  surveyID: '',
};
export const SynchronyTask: any = {
  assestment_id: 'SynchronyTask',
  noOfAttempt: 0,
  attempt1: {},
  attempt2: {},
  attempt3: {},
  useID: '',
  surveyID: '',
};
export const LanguageSamplingTask: any = {
  assestment_id: 'LanguageSamplingTask',
  noOfAttempt: 0,
  attempt1: {},
  attempt2: {},
  attempt3: {},
  useID: '',
  surveyID: '',
};
export const WheelTask: any = {
  assestment_id: 'WheelTask',
  noOfAttempt: 0,
  attempt1: {},
  attempt2: {},
  attempt3: {},
  useID: '',
  surveyID: '',
};
export const PreferentialLookingTask: any = {
  assestment_id: 'PreferentialLookingTask',
  noOfAttempt: 0,
  attempt1: {},
  attempt2: {},
  attempt3: {},
  useID: '',
  surveyID: '',
};

export const InitialSurveyState: any = {
  BubblePoppingTask: {
    ...BubblePoppingData,
  },
  MotorFollowingTask: {
    ...MotorFollowingData,
  },
  ButtonTask: {
    ...ButtonTaskData,
  },
  SynchronyTask: { ...SynchronyTask },
  LanguageSamplingTask: { ...LanguageSamplingTask },
  WheelTask: {
    ...WheelTask,
  },
  PreferentialLookingTask: {
    ...PreferentialLookingTask,
  },
};

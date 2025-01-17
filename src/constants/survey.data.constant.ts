import { getLocalStorageValue } from '@utils/localStorage';
import { BubblePoppingType, MotorFollowingType } from 'types/survey.types';
import { LOCALSTORAGE } from './storage.constant';

const LOGGED_IN_USER = getLocalStorageValue(LOCALSTORAGE.LOGGED_IN_USER, true);
const { childID, childDOB, childGender } = LOGGED_IN_USER || {};

const createTaskData = (assestment_id: string): any => ({
  assestment_id,
  noOfAttempt: 0,
  attempt1: {},
  attempt2: {},
  attempt3: {},
  userID: '',
});

const createInitialState = (taskIds: string[]) => {
  return taskIds.reduce((state, taskId) => {
    state[taskId] = {
      ...createTaskData(taskId),
      userID: childID,
      userDOB: childDOB,
      userGender: childGender,
    };
    return state;
  }, {} as Record<string, any>);
};

export const BubblePoppingData: BubblePoppingType =
  createTaskData('BubblePoppingTask');
export const MotorFollowingData: MotorFollowingType =
  createTaskData('MotorFollowingTask');
export const ButtonTaskData: MotorFollowingType = createTaskData('ButtonTask');

export const InitialSurveyState = createInitialState([
  'BubblePoppingTask',
  'DelayedGratificationTask',
  'MotorFollowingTask',
  'ButtonTask',
  'SynchronyTask',
  'LanguageSamplingTask',
  'WheelTask',
  'PreferentialLookingTask',
]);

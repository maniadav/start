// dynamic initial survey data for survey provider
import { getLocalStorageValue } from "@utils/localStorage";
import { LOCALSTORAGE } from "./storage.constant";
import TASK_TYPE from "./survey.type.constant";

export const getInitialSurveyState = () => {
  const LOGGED_IN_USER =
    getLocalStorageValue(LOCALSTORAGE.LOGGED_IN_USER, true) || {};
  const { childID, childDOB, childGender, observerID } = LOGGED_IN_USER;
  const createTaskData = (assessment_id: string): any => ({
    assessment_id,
    noOfAttempt: 0,
    attempt1: {},
    attempt2: {},
    attempt3: {},
    userID: childID,
    userDOB: childDOB,
    userGender: childGender,
    observerID,
  });

  return TASK_TYPE.reduce((state, taskId) => {
    state[taskId] = createTaskData(taskId);
    return state;
  }, {} as Record<string, any>);
};

import TASK_TYPE from "./survey.type.constant";
import { getCurrentMember, getCurrentUser } from "@utils/auth.utils";

export const getInitialSurveyState = () => {
  const user = getCurrentUser() || {};
  const member = getCurrentMember() || {};
  const { childID, childDob, childGender } = user;
  const { userId: observerId } = member;

  const createTaskData = (assessment_id: string): any => ({
    assessment_id,
    noOfAttempt: 0,
    attempt1: {},
    attempt2: {},
    attempt3: {},
    userId: childID,
    userDob: childDob,
    userGender: childGender,
    observerId,
  });

  return TASK_TYPE.reduce((state, taskId) => {
    state[taskId] = createTaskData(taskId);
    return state;
  }, {} as Record<string, any>);
};

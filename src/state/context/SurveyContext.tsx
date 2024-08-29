"use client";
import React, { createContext } from "react";
import { SurveyState, Action } from "state/reducer/SurveyReducer";

interface SurveyContextProps {
  state: SurveyState;
  dispatch: React.Dispatch<Action>;
}

const SurveyContext = createContext<SurveyContextProps | undefined>(undefined);
export default SurveyContext;

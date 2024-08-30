"use client";
import { createContext, SetStateAction, Dispatch } from "react";

interface PreferentialLookingStateInterface {
  gazeData: any[] | undefined;
  setGazeData: Dispatch<SetStateAction<string[] | undefined>>;
}

const PreferentialLookingStateContext = createContext<
  PreferentialLookingStateInterface | undefined
>(undefined);

export default PreferentialLookingStateContext;

"use client";
import { createContext, SetStateAction, Dispatch } from "react";

interface MotorStateContextProps {
  drumClicks: string[] | undefined;
  stickClick: string[] | undefined;
  setDrumClicks: Dispatch<SetStateAction<string[] | undefined>>;
  setStickClicks: Dispatch<SetStateAction<string[] | undefined>>;
}

const SynchronyStateContext = createContext<MotorStateContextProps | undefined>(
  undefined
);

export default SynchronyStateContext;

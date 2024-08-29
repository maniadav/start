"use client";
import { Coordinate } from "types/survey.types";
import { createContext, SetStateAction, Dispatch } from "react";

interface MotorStateContextProps {
  ballCoordinates: Coordinate[];
  mouseCoordinates: Coordinate[];
  setBallCoordinates: Dispatch<SetStateAction<Coordinate[]>>;
  setMouseCoordinates: Dispatch<SetStateAction<Coordinate[]>>;
}

const MotorStateContext = createContext<MotorStateContextProps | undefined>(
  undefined
);

export default MotorStateContext;

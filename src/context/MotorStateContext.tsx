"use client";
import { Coordinate } from "types/survey.types";
import React, {
  createContext,
  ReactNode,
  useContext,
  SetStateAction,
  Dispatch,
  useState,
} from "react";

interface MotorStateProps {
  name: string;
}

interface MotorStateContextProps {
  ballCoordinates: Coordinate[];
  mouseCoordinates: Coordinate[];
  setBallCoordinates: Dispatch<SetStateAction<Coordinate[]>>;
  setMouseCoordinates: Dispatch<SetStateAction<Coordinate[]>>;
}

const MotorStateContext = createContext<MotorStateContextProps | undefined>(
  undefined
);

const MotorStateProvider = ({ children }: { children: ReactNode }) => {
  const [ballCoordinates, setBallCoordinates] = useState([{ x: 0, y: 0 }]);
  const [mouseCoordinates, setMouseCoordinates] = useState([{ x: 0, y: 0 }]);

  return (
    <MotorStateContext.Provider
      value={{
        ballCoordinates,
        setBallCoordinates,
        mouseCoordinates,
        setMouseCoordinates,
      }}
    >
      {children}
    </MotorStateContext.Provider>
  );
};

const useMotorStateContext = () => {
  const context = useContext(MotorStateContext);
  if (!context) {
    throw new Error("component not under context provider");
  }
  return context;
};

export { MotorStateProvider, useMotorStateContext };

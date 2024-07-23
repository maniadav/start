"use client";
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
  currentUser: MotorStateProps | null;
  setCurrentUser: Dispatch<SetStateAction<MotorStateProps | null>>;
}

const MotorStateContext = createContext<any | undefined>(undefined);

const MotorStateProvider = ({ children }: { children: ReactNode }) => {
  const [ballCoordinates, setBallCoordinates] = useState([]);
  const [mouseCoordinates, setMouseCoordinates] = useState([]);

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
    throw new Error(
      "component not under context provider"
    );
  }
  return context;
};

export { MotorStateProvider, useMotorStateContext };

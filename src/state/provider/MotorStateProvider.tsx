"use client";
import React, { ReactNode, useContext, useState } from "react";
import MotorStateContext from "state/context/MotorStateContext";

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

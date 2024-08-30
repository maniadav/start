"use client";
import React, { ReactNode, useContext, useState } from "react";
import PreferentialLookingStateContext from "state/context/PreferentialLookingStateContext";

const PreferentialLookingStateProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [gazeData, setGazeData] = useState<any[] | undefined>([]);

  return (
    <PreferentialLookingStateContext.Provider
      value={{
        gazeData,
        setGazeData,
      }}
    >
      {children}
    </PreferentialLookingStateContext.Provider>
  );
};

const usePreferentialLookingStateContext = () => {
  const context = useContext(PreferentialLookingStateContext);
  if (!context) {
    throw new Error("component not under context provider");
  }
  return context;
};

export { PreferentialLookingStateProvider, usePreferentialLookingStateContext };

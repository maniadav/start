'use client';
import React, { ReactNode, useContext, useState } from 'react';
import SynchronyStateContext from 'state/context/SynchronyStateContext';

const SynchronyStateProvider = ({ children }: { children: ReactNode }) => {
  const [drumClicks, setDrumClicks] = useState<number[]>([0]);
  const [stickClick, setStickClicks] = useState<number[]>([0]);
  const [drumHit, setDrumHit] = useState<number[]>([0]);

  return (
    <SynchronyStateContext.Provider
      value={{
        drumClicks,
        setDrumClicks,
        stickClick,
        setStickClicks,
        drumHit,
        setDrumHit,
      }}
    >
      {children}
    </SynchronyStateContext.Provider>
  );
};

const useSynchronyStateContext = () => {
  const context = useContext(SynchronyStateContext);
  if (!context) {
    throw new Error('component not under context provider');
  }
  return context;
};

export { SynchronyStateProvider, useSynchronyStateContext };

'use client';
import { createContext, SetStateAction, Dispatch } from 'react';

interface MotorStateContextProps {
  drumClicks: number[];
  stickClick: number[];
  drumHit: number[];
  setDrumHit: Dispatch<SetStateAction<number[]>>;
  setDrumClicks: Dispatch<SetStateAction<number[]>>;
  setStickClicks: Dispatch<SetStateAction<number[]>>;
}

const SynchronyStateContext = createContext<MotorStateContextProps>({
  drumClicks: [],
  stickClick: [],
  drumHit: [],
  setDrumHit: () => {},
  setDrumClicks: () => {},
  setStickClicks: () => {},
});

export default SynchronyStateContext;

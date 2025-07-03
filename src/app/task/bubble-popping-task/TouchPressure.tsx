"use client";
import { useState } from "react";

const TouchPressureComponent = () => {
  const [pressure, setPressure] = useState(0);
  const [touchArea, setTouchArea] = useState<number | null>(null);
  const [pressStart, setPressStart] = useState<number | null>(null);
  const [pressDuration, setPressDuration] = useState(0);

  const handleTouchStart = (e: any) => {
    const startTime = Date.now();
    setPressStart(startTime);
    console.log(e.touches[0]);
    if (e.touches.length > 0) {
      const touch = e.touches[0];

      const radiusX = touch.radiusX || 1;
      const radiusY = touch.radiusY || 1;
      const area = Math.PI * radiusX * radiusY;
      const force = touch.force !== undefined ? touch.force : 0;

      setTouchArea(area);
      setPressure(force);
    }
  };

  const handleTouchEnd = () => {
    if (pressStart) {
      const duration = Date.now() - pressStart;
      setPressDuration(duration);

      console.log({
        area: touchArea?.toFixed(2) || 0,
        pressure: pressure.toFixed(2),
        duration: duration,
      });
    }
    setPressStart(null);
  };

  return (
    <div className="w-screen py-20 justify-center align-middle items-center flex flex-col">
      <button
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="w-52 h-52 bg-red-500 rounded-full"
      ></button>
      <p>Area: {touchArea?.toFixed(2) || 0}</p>
      <h1>Pressure: {pressure.toFixed(2)}</h1>
      <h1>Duration: {pressDuration}</h1>
    </div>
  );
};

export default TouchPressureComponent;

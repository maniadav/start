"use client";
import { useState } from "react";

const TouchPressureComponent = () => {
  const [pressure, setPressure] = useState(0);
  const [touchArea, setTouchArea] = useState<any>(null);

  const handleTouchStarst = (e: any) => {
    setPressStart(Date.now());
    if (e.touches?.length > 0) {
      const touch = e.touches[0];
      const radiusX = touch.radiusX || 0;
      const radiusY = touch.radiusY || 0;
      const area = Math.PI * radiusX * radiusY; // area of eclipse
      setTouchArea(area);
    }
  };

  const handleTouchMove = (e: any) => {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      setPressure(touch.force || 0);
    }
  };

  //   touch timing
  const [pressStart, setPressStart] = useState<any>(null);
  const [pressDuration, setPressDuration] = useState(0);

  const handleMouseDown = () => {
    setPressStart(Date.now());
  };

  const handleMouseUp = () => {
    if (pressStart) {
      const duration = Date.now() - pressStart;
      setPressDuration(duration);
    }
    setPressStart(null);
  };

  const handleTouchStart = (e: any) => {
    const startTime = Date.now();
    setPressStart(startTime);

    if (e.touches.length > 0) {
      const touch = e.touches[0];
      const radiusX = touch.radiusX || 0;
      const radiusY = touch.radiusY || 0;
      const area = Math.PI * radiusX * radiusY;
      setTouchArea(area);
    }
  };

  const handleTouchEnd = () => {
    if (pressStart) {
      const duration = Date.now() - pressStart;
      setPressDuration(duration);
    }
    setPressStart(null);
  };

  return (
    <div
      onTouchMove={handleTouchMove}
      className="w-screen h-screen justify-center align-middle items-center flex flex-col"
    >
      <h1>This Area Used for Touch Presure</h1>
      <h1>Pressure: {pressure}</h1>
      <button
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        className="w-52 h-52 bg-black rounded-full"
      >
        Touch Duration
      </button>
      <p>Last press duration: {pressDuration || 0} ms</p>

      <button
        onTouchStart={handleTouchStart}
        onTouchEnd={handleMouseUp}
        className="w-52 h-52 bg-red-500 rounded-full"
      ></button>
      <p>Last touch area: {touchArea?.toFixed(2) || 0} square pixels</p>

      <button
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="w-52 h-52 bg-blue-500 rounded-full text-white"
      ></button>
      <p>Last press duration: {pressDuration || 0} ms</p>
      {touchArea !== null && (
        <p>Last touch area: {touchArea.toFixed(2)} square pixels</p>
      )}
    </div>
  );
};

export default TouchPressureComponent;

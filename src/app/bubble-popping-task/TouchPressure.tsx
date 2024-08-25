"use client"
import { useState } from "react";

const TouchPressureComponent = () => {
  const [pressure, setPressure] = useState(0);

  const handleTouchMove = (e: any) => {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      setPressure(touch.force || 0);
    }
  };

  return (
    <div
      onTouchMove={handleTouchMove}
      style={{
        width: "100%",
        height: "100vh",
        backgroundColor: `rgba(0, 0, 255, ${pressure})`,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h1>Pressure: {pressure}</h1>
    </div>
  );
};

export default TouchPressureComponent;

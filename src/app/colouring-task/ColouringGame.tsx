"use client";
import React, { useRef, useState, useEffect, MouseEvent } from "react";
import styles from "./ColouringGame.module.css";

const colors = ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff"];

const ColouringGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(5);
  const [drawingPoints, setDrawingPoints] = useState<
    Array<{ x: number | null; y: number | null }>
  >([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext("2d");
      if (context) {
        context.lineCap = "round";
        context.strokeStyle = brushColor;
        context.lineWidth = brushSize;
        contextRef.current = context;

        // Load and draw the background image
        const backgroundImage = new Image();
        backgroundImage.src = "/cat.jpg"; // Ensure this path is correct
        backgroundImage.onload = () => {
          context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
        };
      }
    }
  }, [brushColor, brushSize]);

  const startDrawing = ({ nativeEvent }: MouseEvent<HTMLCanvasElement>) => {
    const { offsetX, offsetY } = nativeEvent;
    if (contextRef.current) {
      contextRef.current.beginPath();
      contextRef.current.moveTo(offsetX, offsetY);
      setIsDrawing(true);
    }
  };

  const finishDrawing = () => {
    if (contextRef.current) {
      contextRef.current.closePath();
      setIsDrawing(false);
      setDrawingPoints((prev) => [...prev, { x: null, y: null }]);
    }
  };

  const draw = ({ nativeEvent }: MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !contextRef.current) return;
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
    setDrawingPoints((prev) => [...prev, { x: offsetX, y: offsetY }]);
  };

  const saveImage = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const link = document.createElement("a");
      link.download = "drawing.png";
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <div className="w-full flex justify-center items-center">
        <canvas
          ref={canvasRef}
          width={600}
          height={600}
          className={styles.canvas}
          onMouseDown={startDrawing}
          onMouseUp={finishDrawing}
          onMouseMove={draw}
        />
      </div>
      <div className={styles.controls}>
        {colors.map((color) => (
          <button
            key={color}
            style={{ backgroundColor: color }}
            className={styles.colorButton}
            onClick={() => setBrushColor(color)}
          />
        ))}
        <button onClick={() => setBrushSize(5)}>Small Brush</button>
        <button onClick={() => setBrushSize(10)}>Medium Brush</button>
        <button onClick={() => setBrushSize(20)}>Large Brush</button>
        <button onClick={saveImage}>Save Image</button>
      </div>
    </div>
  );
};

export default ColouringGame;

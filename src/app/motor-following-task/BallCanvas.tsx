"use client";

import useWindowSize from "@hooks/useWindowSize";
import { useEffect, useRef, useState } from "react";

const BallCanvas = () => {
  const [screenSize, setScreenSize] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { windowSize } = useWindowSize();

  const [isDrawing, setIsDrawing] = useState(false);
  const [drawingPoints, setDrawingPoints] = useState<
    { x: number; y: number; time: number }[]
  >([]);

  useEffect(() => {
    if (windowSize.width && windowSize.height) {
      setScreenSize({ width: windowSize.width, height: windowSize.height });
    }
  }, [windowSize]);

  useEffect(() => {
    if (!canvasRef.current || !screenSize) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (!context) return;

    const canvasWidth = screenSize.width;
    const canvasHeight = screenSize.height;

    function generateRandomAmplitude(base = 50, variance = 10) {
      return Math.random() * variance + base; // Random amplitude with base and variance
    }

    function generateRandomFrequency(base = 0.02, variance = 0.01) {
      return Math.random() * variance + base; // Random frequency with base and variance
    }

    // Generate the complex sine wave path data
    const amplitudeA = generateRandomAmplitude(20, 30); // Base 20, variance 30
    const frequencyA = generateRandomFrequency(0.01, 0.02); // Base 0.01, variance 0.02
    const amplitudeB = generateRandomAmplitude(40, 40); // Base 40, variance 40
    const frequencyB = generateRandomFrequency(0.05, 0.02); // Base 0.05, variance 0.02

    const wavePath: { x: number; y: number }[] = [];

    for (let xCoord = 0; xCoord < canvasWidth; xCoord++) {
      const yCoord1 = amplitudeA * Math.sin(xCoord * frequencyA);
      const yCoord2 = amplitudeB * Math.sin(xCoord * frequencyB);
      const yCoord = canvasHeight / 2 + yCoord1 + yCoord2;
      wavePath.push({ x: xCoord, y: yCoord });
    }

    // Draw the sine wave
    function renderWave() {
      if (context) {
        context.clearRect(0, 0, canvasWidth, canvasHeight);
        context.beginPath();
        context.moveTo(wavePath[0].x, wavePath[0].y);
        for (let i = 1; i < wavePath.length; i++) {
          context.lineTo(wavePath[i].x, wavePath[i].y);
        }
        context.strokeStyle = "#3498db";
        context.lineWidth = 2;
        context.stroke();
      }
    }

    // Animation settings
    const animationDuration = 5000; // Animation duration in ms
    let initialTime = 0;
    let animationId = 0;

    function moveBall(timestamp: number) {
      if (!initialTime) initialTime = timestamp;
      const timeElapsed = timestamp - initialTime;
      const animationProgress = timeElapsed / animationDuration;

      // Stop the animation at the end
      if (animationProgress >= 1) {
        cancelAnimationFrame(animationId);
        // Log final position and time
        const finalCoords = wavePath[wavePath.length - 1];
        console.log(
          `Time: ${timeElapsed.toFixed(
            2
          )} ms, Final Position: (${finalCoords.x.toFixed(
            2
          )}, ${finalCoords.y.toFixed(2)})`
        );
        return;
      }

      // Calculate the position on the path
      const currentPointIndex = Math.floor(
        animationProgress * (wavePath.length - 1)
      );
      const currentPoint = wavePath[currentPointIndex];

      // Draw wave and ball
      renderWave();

      if (context) {

      context.beginPath();
      context.arc(currentPoint.x, currentPoint.y, 5, 0, 2 * Math.PI);
      context.fillStyle = "red";
      context.fill();
      }

      // Log ball position and elapsed time
      console.log(
        `Time: ${timeElapsed.toFixed(
          2
        )} ms, Position: (${currentPoint.x.toFixed(
          2
        )}, ${currentPoint.y.toFixed(2)})`
      );

      // Draw the user's drawing points
      drawUserDrawing();

      animationId = requestAnimationFrame(moveBall);
    }

    // Function to draw user's drawing points
    function drawUserDrawing() {

      if (context) {
              context.strokeStyle = "#ff0000";
      context.lineWidth = 2;
      context.lineCap = "round";

      for (let i = 0; i < drawingPoints.length - 1; i++) {
        const startPoint = drawingPoints[i];
        const endPoint = drawingPoints[i + 1];
        context.beginPath();
        context.moveTo(startPoint.x, startPoint.y);
        context.lineTo(endPoint.x, endPoint.y);
        context.stroke();
      }
      }

    }

    // Start the animation
    renderWave();
    animationId = requestAnimationFrame(moveBall);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [screenSize, drawingPoints]);

  // Event handlers for drawing
  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    recordDrawingPoint(event.nativeEvent.offsetX, event.nativeEvent.offsetY);
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDrawing) {
      recordDrawingPoint(event.nativeEvent.offsetX, event.nativeEvent.offsetY);
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  // Function to record drawing points
  const recordDrawingPoint = (x: number, y: number) => {
    const timeElapsed = performance.now();
    setDrawingPoints((prevPoints) => [
      ...prevPoints,
      { x, y, time: timeElapsed },
    ]);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <canvas
        ref={canvasRef}
        id="waveCanvas"
        className="border-2 border-gray-300"
        width={screenSize?.width || 200}
        height={screenSize?.height || 300}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      ></canvas>
    </div>
  );
};

export default BallCanvas;

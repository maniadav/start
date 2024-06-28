import React, { useRef, useState, useEffect, MouseEvent } from "react";
import styles from "./ColouringGame.module.css";
import { CommonButton } from "components/common/CommonButton";
import MessagePopup from "components/common/MessagePopup";
import { useSearchParams } from "next/navigation";

const colors = ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff"];

interface Coordinate {
  x: number;
  y: number;
  color: string;
}

const ColouringGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState("#000000");
  const [drawnCoordinates, setDrawnCoordinates] = useState<Coordinate[]>([]);
  const [showPopup, setShowPopup] = useState<boolean>(false);

  const searchParams = useSearchParams();
  const attemptString = searchParams.get("attempt") || "0";
  const attempt = parseInt(attemptString);
  const brushSize = 10;
  const reAttemptUrl =
    attempt < 3 ? `colouring-task?attempt=${attempt + 1}` : null;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext("2d");
      if (context) {
        context.lineCap = "round";
        context.lineWidth = brushSize;
        contextRef.current = context;

        // Load and draw the background image
        const backgroundImage = new Image();
        backgroundImage.src = "/car.png"; // Ensure this path is correct
        backgroundImage.onload = () => {
          context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
        };

        // Redraw existing paths
        drawnCoordinates.forEach((coord) => {
          context.strokeStyle = coord.color;
          context.beginPath();
          context.moveTo(coord.x, coord.y);
          context.lineTo(coord.x + 1, coord.y + 1); // Dummy move to trigger stroke
          context.stroke();
        });
      }
    }
  }, []);

  const startDrawing = ({ nativeEvent }: MouseEvent<HTMLCanvasElement>) => {
    const { offsetX, offsetY } = nativeEvent;
    if (contextRef.current) {
      contextRef.current.strokeStyle = brushColor;
      contextRef.current.beginPath();
      contextRef.current.moveTo(offsetX, offsetY);
      setIsDrawing(true);
    }
  };

  const finishDrawing = () => {
    if (contextRef.current) {
      contextRef.current.closePath();
      setIsDrawing(false);
      // setDrawingPoints([]);
    }
  };

  const draw = ({ nativeEvent }: MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !contextRef.current) return;
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
    setDrawnCoordinates([
      ...drawnCoordinates,
      { x: offsetX, y: offsetY, color: brushColor },
    ]);
  };

  const handleCloseGame = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const link = document.createElement("a");
      link.download = "drawing.png";
      link.href = canvas.toDataURL();
      link.click();
    }
    setShowPopup(true);
  };

  const handleColorChange = (color: string) => {
    setBrushColor(color);
  };

  useEffect(() => {
    console.log(drawnCoordinates);
  }, [drawnCoordinates]);

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* //       <div className="absolute h-full w-full flex justify-center items-center align-middle">
//         <canvas
//           ref={canvasRef}
//           width={600}
//           height={600}
//           className={styles.canvas}
//           onMouseDown={startDrawing}
//           onMouseUp={finishDrawing}
//           onMouseMove={draw}
//         />
//       </div>
//       <div className="absolute h-full w-full flex justify-start items-center align-middle">
//         <div className="flex flex-col items-center gap-4 pl-6">
//           {colors.map((color) => (
//             <button
//               key={color}
//               style={{ backgroundColor: color }}
//               className="w-12 h-12 rounded-full border-2 shadow-md border-gray-600"
//               onClick={() => handleColorChange(color)}
//             />
//           ))}
//           <CommonButton
//             clicked={saveImage}
//             btnIcon={"fluent:save-image-20-filled"}
//             customClass={"rounded-full bg-blue-700 p-4"}
//           />
//         </div>
//       </div> */}

      <div className="absolute h-full w-full flex justify-center items-center align-middle">
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
      <div className="absolute flex flex-col gap-5 pl-20 pt-20">
        {colors.map((color) => (
          <button
            key={color}
            style={{ backgroundColor: color }}
            className="w-8 h-8 rounded-full border shadow-md border-gray-600"
            onClick={() => handleColorChange(color)}
          />
        ))}

        <CommonButton
          clicked={handleCloseGame}
          btnIcon={"fluent:save-image-20-filled"}
          customClass={"rounded-full"}
        />
      </div>
      <MessagePopup
        showFilter={showPopup}
        msg={
          "You have completed the Bubble Popping Task. You can now make another attempt for this test, go back to the survey dashboard or start the new task. "
        }
        testName={"bubble popping"}
        reAttemptUrl={reAttemptUrl}
      />
    </div>
  );
};

export default ColouringGame;

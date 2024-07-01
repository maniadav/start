// "use client";
// import React, { useRef, useState, useEffect, MouseEvent } from "react";
// import butterflySvg from "/butterfly.png";

// const MototFollowingTask: React.FC = () => {
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const contextRef = useRef<CanvasRenderingContext2D | null>(null);
//   const [isDrawing, setIsDrawing] = useState(false);
//   const [drawingPoints, setDrawingPoints] = useState<
//     Array<{ x: number | null; y: number | null }>
//   >([]);
//   const [image, setImage] = useState<string>("/motor_bg.jpg");
//   const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       setWindowSize({ width: window.innerWidth, height: window.innerHeight });
//     }

//     const handleResize = () => {
//       setWindowSize({ width: window.innerWidth, height: window.innerHeight });
//     };

//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (canvas) {
//       const context = canvas.getContext("2d");
//       if (context) {
//         context.lineCap = "round";
//         context.strokeStyle = "#ff0000"; // Red color
//         context.lineWidth = 10; // Brush size
//         contextRef.current = context;

//         const img = new Image();
//         img.src = image;
//         img.onload = () => {
//           context.drawImage(img, 0, 0, canvas.width, canvas.height);
//         };
//       }
//     }
//   }, [image]);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (canvas) {
//       const context = canvas.getContext("2d");
//       if (context) {
//         let x = canvas.width;
//         const pathAmplitude = 50;
//         const pathFrequency = 0.01;
//         const butterfly = new Image();
//         butterfly.src = "/butterfly.png";

//         // background image
//         // const backgroundImage = new Image();
//         // backgroundImage.src = "/motor_bg.jpg"; // Ensure this path is correct
//         // backgroundImage.onload = () => {
//         //   context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
//         // };

//         const animate = () => {
//           context.clearRect(0, 0, canvas.width, canvas.height);
//           const img = new Image();
//           img.src = image;
//           img.onload = () => {
//             context.drawImage(img, 0, 0, canvas.width, canvas.height);
//             context.drawImage(
//               butterfly,
//               x,
//               canvas.height / 2 + pathAmplitude * Math.sin(pathFrequency * x)
//             );
//           };

//           x -= 2; // Move left by 2 pixels

//           if (x > -butterfly.width) {
//             requestAnimationFrame(animate);
//           } else {
//             x = canvas.width; // Reset to start from the right again
//           }
//         };

//         animate();
//       }
//     }
//   }, []);

//   const startDrawing = ({ nativeEvent }: MouseEvent<HTMLCanvasElement>) => {
//     const { offsetX, offsetY } = nativeEvent;
//     if (contextRef.current) {
//       contextRef.current.beginPath();
//       contextRef.current.moveTo(offsetX, offsetY);
//       setIsDrawing(true);
//     }
//   };

//   const finishDrawing = () => {
//     if (contextRef.current) {
//       contextRef.current.closePath();
//       setIsDrawing(false);
//       setDrawingPoints((prev) => [...prev, { x: null, y: null }]);
//     }
//   };

//   const draw = ({ nativeEvent }: MouseEvent<HTMLCanvasElement>) => {
//     if (!isDrawing || !contextRef.current) return;
//     const { offsetX, offsetY } = nativeEvent;
//     const canvas = canvasRef.current;
//     if (canvas) {
//       const x = (offsetX / canvas.width) * 100;
//       const y = (offsetY / canvas.height) * 100;
//       contextRef.current.lineTo(offsetX, offsetY);
//       contextRef.current.stroke();
//       setDrawingPoints((prev) => [...prev, { x, y }]);
//     }
//   };

//   const saveImage = () => {
//     const canvas = canvasRef.current;
//     if (canvas) {
//       const link = document.createElement("a");
//       link.download = "drawing.png";
//       link.href = canvas.toDataURL();
//       link.click();
//     }
//   };

//   return (
//     <div className="relative w-screen h-screen overflow-hidden">
//       <div className="w-full h-full flex justify-center items-center">
//         <canvas
//           ref={canvasRef}
//           width={windowSize.width}
//           height={windowSize.height}
//           className="border border-black"
//           onMouseDown={startDrawing}
//           onMouseUp={finishDrawing}
//           onMouseMove={draw}
//         />
//       </div>
//       <div className="absolute top-4 right-4 flex flex-col space-y-2">
//         <button
//           className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
//           onClick={saveImage}
//         >
//           Save Image
//         </button>
//       </div>
//     </div>
//   );
// };

// export default MototFollowingTask;
// components/SVGBall.tsx
export const SVGBall: React.FC = () => (
  <svg width="24" height="24" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" fill="red" />
  </svg>
);

// components/MovingBall.tsx
import { useEffect, useRef } from "react";

const MovingBall: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ballRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const ball = ballRef.current;
    if (!ball) return;

    const ballImage = new Image();
    const ballRadius = 12; // Radius of the ball
    let x = canvas.width - ballRadius; // Start position of the ball
    const y = canvas.height / 2; // Vertical center position

    ballImage.src = "data:image/svg+xml," + encodeURIComponent(ball.outerHTML);

    const drawBall = (x: number, y: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(
        ballImage,
        x - ballRadius,
        y - ballRadius,
        ballRadius * 2,
        ballRadius * 2
      );
    };

    const animate = () => {
      if (x > ballRadius) {
        x -= 2; // Move the ball to the left
        const yPos = canvas.height / 2 + 50 * Math.sin(x / 50); // Sinusoidal path
        drawBall(x, yPos);
        requestAnimationFrame(animate);
      } else {
        drawBall(ballRadius, canvas.height / 2);
      }
    };

    ballImage.onload = () => {
      drawBall(x, y);
      animate();
    };
  }, []);

  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const getBallCoordinates = () => {
      if (!svgRef.current) return;

      const svgRect = svgRef.current.getBoundingClientRect();
      const circle = svgRef.current.querySelector("circle");

      if (!circle) return; // Handle potential missing circle

      const circleRect = circle.getBoundingClientRect();

      const ballX = circleRect.left - svgRect.left + circleRect.width / 2;
      const ballY = circleRect.top - svgRect.top + circleRect.height / 2;

      console.log("Ball coordinates:", ballX, ballY);
    };

    getBallCoordinates(); // Call on initial render
  }, []);

  return (
    <div className="relative w-full h-screen bg-gray-100 flex items-center justify-center">
      {/* <div className="relative w-full h-full">
        <div className="relative w-full h-full">
          <canvas ref={canvasRef} className="absolute w-full h-full" />
          <div ref={ballRef} className="">
            <SVGBall />
          </div>
        </div>
      </div> */}

      <div className="w-full h-full">
        {/* <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          preserveAspectRatio="xMidYMin slice"
          viewBox="0 0 600 220"
          className="w-full h-full"
          fill="red"
          ref={svgRef}
        >
          <path
            id="a"
            fill="black"
            stroke="#d3d3d3"
            stroke-width="1"
            d="M 50 100
              s 50 32 100 -14
              50 87 100 -10
              50 5 100 60
              50 -49 100 30
              50 -79 100 -70"
          /> */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          viewBox="0 0 100 37"
          preserveAspectRatio="xMidYMid meet"
          className="w-screen h-auto"
          fill="red"
          ref={svgRef}
        >
          <path
            id="a"
            fill="none"
            stroke="#d3d3d3"
            strokeWidth="1"
            d="M 0 18.5
          C 25 8, 50 28, 75 18.5
          S 100 8, 100 18.5"
          />
          <circle r="3" fill="red">
            <animateMotion dur="10s" repeatCount="indefinite">
              <mpath xlinkHref="#a" />
            </animateMotion>
          </circle>
          {/* <image
          href="/butterfly.png" // Ensure the path to your image is correct
          height="30" // Adjust the size as needed
          width="30" // Adjust the size as needed
          transform="translate(0, -15)" // Move up by half the height (15 for height 30)
        >
          <animateMotion dur="6s" fill="freeze" repeatCount="indefinite">
            <mpath xlinkHref="#a" />
          </animateMotion>
        </image> */}
          {/* <image
            href="/butterfly.svg" // Ensure the path to your image is correct
            height="30" // Adjust the size as needed
            width="30" // Adjust the size as needed
            className="absolute bg-black rotate-90 translate-x-[15px]"
             transform="translate(0, -15)"
          >
            <animateMotion dur="6s" repeatCount="indefinite">
              <mpath xlinkHref="#a" />
            </animateMotion>
          </image> */}
        </svg>
      </div>
    </div>
  );
};

export default MovingBall;

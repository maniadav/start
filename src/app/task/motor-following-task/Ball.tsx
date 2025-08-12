// export default function Ball(
//   x: number,
//   y: number,
//   r: number,
//   c: string,
//   ctx: CanvasRenderingContext2D,
//   startX: number = ctx.canvas.width,
//   startY: number = ctx.canvas.height / 2,
//   endX: number = 0,
//   endY: number = ctx.canvas.height / 2,
//   controlX1: number = ctx.canvas.width * 0.75,
//   controlY1: number = ctx.canvas.height * 0.25,
//   controlX2: number = ctx.canvas.width * 0.25,
//   controlY2: number = ctx.canvas.height * 0.75,
//   speed: number = 0.002
// ) {
//   let t = 0; // Parameter to control the animation progress
//   let isMoving = true;
//   // const butterflyImage = new Image();
//   // butterflyImage.src = "/butterfly-svg.png"; // Ensure this path is correct

//   // function draw() {
//   //   // ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); // Clear the canvas before drawing
//   //   // Ensure the image is fully loaded before drawing it
//   //   if (butterflyImage.complete) {
//   //     ctx.drawImage(butterflyImage, x - r / 2, y - r / 2, r, r);
//   //   } else {
//   //     butterflyImage.onload = () => {
//   //       ctx.drawImage(butterflyImage, x - r / 2, y - r / 2, r, r);
//   //     };
//   //   }
//   // }

//   function draw() {
//     ctx.beginPath();
//     ctx.fillStyle = c;
//     ctx.arc(x, y, r, 0, Math.PI * 2);
//     ctx.fill();
//   }

//   function animate() {
//     if (t <= 1) {
//       // Calculate the next position based on the Bezier curve
//       x = calculateBezierPoint(t, startX, controlX1, controlX2, endX);
//       y = calculateBezierPoint(t, startY, controlY1, controlY2, endY);
//       t += speed; // Increment the parameter to move along the path
//     } else {
//       isMoving = false; // Ball has stopped moving
//     }
//     draw();
//   }

//   function calculateBezierPoint(
//     t: number,
//     p0: number,
//     p1: number,
//     p2: number,
//     p3: number
//   ): number {
//     const oneMinusT = 1 - t;
//     return (
//       oneMinusT * oneMinusT * oneMinusT * p0 +
//       3 * oneMinusT * oneMinusT * t * p1 +
//       3 * oneMinusT * t * t * p2 +
//       t * t * t * p3
//     );
//   }

//   function getPosition(): { x: number; y: number } {
//     return { x, y };
//   }

//   function getIsMoving(): boolean {
//     return isMoving;
//   }

//   return {
//     draw,
//     animate,
//     getPosition,
//     getIsMoving,
//   };
// }

// export default function Ball(
//   x: number,
//   y: number,
//   r: number,
//   c: string,
//   ctx: CanvasRenderingContext2D,
//   amplitude: number = 150,
//   frequency: number = 0.01,
//   phase: number = 0,
//   centerY: number = ctx.canvas.height / 2,
//   speed: number = 0.002
// ) {
//   let t = 0; // Parameter to control the animation progress
//   let isMoving = true;

//   function draw() {
//     ctx.beginPath();
//     ctx.fillStyle = c;
//     ctx.arc(x, y, r, 0, Math.PI * 2);
//     ctx.fill();
//   }

//   function drawSinusoidalCurve(t: number) {
//     ctx.beginPath();
//     ctx.moveTo(0, centerY);

//     for (let i = 0; i <= ctx.canvas.width; i += 1) {
//       const { x, y } = calculateSinusoidalPoint(i / ctx.canvas.width, amplitude, frequency, phase, centerY);
//       ctx.lineTo(x, y);
//     }

//     ctx.stroke();
//   }

//   function animate() {
//     if (t <= 1) {
//       // Calculate the next position based on the sinusoidal curve
//       const point = calculateSinusoidalPoint(t, amplitude, frequency, phase, centerY);
//       x = point.x;
//       y = point.y;
//       t += speed;
//     } else {
//       isMoving = false;
//     }
//     ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
//     drawSinusoidalCurve(t); // Draw the sinusoidal curve
//     draw(); // Draw the ball
//   }

//   function calculateSinusoidalPoint(
//     t: number,
//     amplitude: number,
//     frequency: number,
//     phase: number,
//     centerY: number
//   ): { x: number; y: number } {
//     const x = t * ctx.canvas.width;
//     const y = centerY + amplitude * Math.sin(frequency * x + phase);
//     return { x, y };
//   }

//   function getPosition(): { x: number; y: number } {
//     return { x, y };
//   }

//   function getIsMoving(): boolean {
//     return isMoving;
//   }

//   return {
//     draw,
//     animate,
//     getPosition,
//     getIsMoving,
//   };
// }

export default function Ball(
  x: number,
  y: number,
  r: number,
  c: string,
  ctx: CanvasRenderingContext2D,
  amplitudes: number = 150,
  frequencies: number[] = [0.01, 0.02, 0.01, 0.02], // Frequencies for different amplitudes
  phase: number = 0,
  centerY: number = ctx.canvas.height / 2,
  // speeds: number[] = [0.002, 0.001, 0.002, 0.001] // Speeds for different sections
  speed: number = 0.001
): any {
  let t = 0; // Parameter to control the animation progress
  let isMoving = true;

  function draw() {
    ctx.beginPath();
    ctx.fillStyle = c;
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  function animate() {
    if (t <= 1) {
      // Calculate the next position based on the sinusoidal curve
      const point = calculateSinusoidalPoint(
        t,
        amplitudes,
        frequencies,
        phase,
        centerY
      );
      x = point.x;
      y = point.y;
      t += speed;
      //     // Determine the current speed based on the position along the x-axis
      //     const period = ctx.canvas.width / speeds.length;
      //     const index = Math.floor((t * ctx.canvas.width) / period) % speeds.length;
      //     const speed = speeds[index];
    } else {
      isMoving = false;
    }
    draw();
    // drawSinusoidalCurve(t)
  }



  function drawSinusoidalCurve(t: number) {
    ctx.beginPath();
    ctx.moveTo(0, centerY);

    for (let i = 0; i <= ctx.canvas.width; i += 1) {
      const { x, y } = calculateSinusoidalPoint(
        i / ctx.canvas.width,
        amplitudes,
        frequencies,
        phase,
        centerY
      );
      ctx.lineTo(x, y);
    }

    ctx.stroke();
  }

  function calculateSinusoidalPoint(
    t: number,
    amplitude: number,
    frequency: number[],
    phase: number,
    centerY: number
  ): { x: number; y: number } {
    const x = t * ctx.canvas.width;
    // const y = centerY + amplitude * Math.sin(frequency * x + phase);
    const period = ctx.canvas.width;
    const index = Math.floor(x / period);
    const frequencyy = frequencies[index];
    const y = centerY + amplitude * Math.sin(frequencyy * x + phase);
    return { x, y };
  }

  function getPosition(): { x: number; y: number } {
    return { x, y };
  }

  function getIsMoving(): boolean {
    return isMoving;
  }


  // let startTime = Date.now(); // Record the start time
  // const positions: { time: number; x: number; y: number }[] = [];
  // function logPosition() {
  //   if (isMoving) {
  //     const elapsedTime = (Date.now() - startTime) / 1000; // Elapsed time in seconds
  //     positions.push({ time: elapsedTime, x, y });
  //     console.log(`Logged position: time=${elapsedTime.toFixed(2)}s x=${x}, y=${y}`);
  //   }
  // }

  // // Start logging positions every 0.5 seconds
  // const positionLogger = setInterval(logPosition, 200);

  return {
    draw,
    animate,
    getPosition,
    getIsMoving,
  };
}

export default function Ball(
  x: number,
  y: number,
  r: number,
  c: string,
  ctx: CanvasRenderingContext2D,
  startX: number = ctx.canvas.width,
  startY: number = ctx.canvas.height / 2,
  endX: number = 0,
  endY: number = ctx.canvas.height / 2,
  controlX1: number = ctx.canvas.width * 0.75,
  controlY1: number = ctx.canvas.height * 0.25,
  controlX2: number = ctx.canvas.width * 0.25,
  controlY2: number = ctx.canvas.height * 0.75,
  speed: number = 0.002
) {
  let t = 0; // Parameter to control the animation progress
  let isMoving = true;
  // const butterflyImage = new Image();
  // butterflyImage.src = "/butterfly-svg.png"; // Ensure this path is correct

  // function draw() {
  //   // ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); // Clear the canvas before drawing
  //   // Ensure the image is fully loaded before drawing it
  //   if (butterflyImage.complete) {
  //     ctx.drawImage(butterflyImage, x - r / 2, y - r / 2, r, r);
  //   } else {
  //     butterflyImage.onload = () => {
  //       ctx.drawImage(butterflyImage, x - r / 2, y - r / 2, r, r);
  //     };
  //   }
  // }

  function draw() {
    ctx.beginPath();
    ctx.fillStyle = c;
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  function animate() {
    if (t <= 1) {
      // Calculate the next position based on the Bezier curve
      x = calculateBezierPoint(t, startX, controlX1, controlX2, endX);
      y = calculateBezierPoint(t, startY, controlY1, controlY2, endY);
      t += speed; // Increment the parameter to move along the path
    } else {
      isMoving = false; // Ball has stopped moving
    }
    draw();
  }

  function calculateBezierPoint(
    t: number,
    p0: number,
    p1: number,
    p2: number,
    p3: number
  ): number {
    const oneMinusT = 1 - t;
    return (
      oneMinusT * oneMinusT * oneMinusT * p0 +
      3 * oneMinusT * oneMinusT * t * p1 +
      3 * oneMinusT * t * t * p2 +
      t * t * t * p3
    );
  }

  function getPosition(): { x: number; y: number } {
    return { x, y };
  }

  function getIsMoving(): boolean {
    return isMoving;
  }

  return {
    draw,
    animate,
    getPosition,
    getIsMoving,
  };
}

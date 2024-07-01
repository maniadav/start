// export class Ball {
//   x: number;
//   y: number;
//   r: number;
//   c: string;
//   t: number;
//   ctx: CanvasRenderingContext2D;
//   startX: number;
//   startY: number;
//   endX: number;
//   endY: number;
//   controlX1: number;
//   controlY1: number;
//   controlX2: number;
//   controlY2: number;
//   speed: number;

//   constructor(
//     x: number,
//     y: number,
//     r: number,
//     c: string,
//     ctx: CanvasRenderingContext2D,
//     startX?: number,
//     startY?: number,
//     endX?: number,
//     endY?: number,
//     controlX1?: number,
//     controlY1?: number,
//     controlX2?: number,
//     controlY2?: number,
//     speed: number = 0.002
//   ) {
//     this.x = x;
//     this.y = y;
//     this.r = r;
//     this.c = c;
//     this.ctx = ctx;

//     this.t = 0; // Parameter to control the animation progress

//     // Define Bezier curve control points with defaults
//     this.startX = startX ?? ctx.canvas.width;
//     this.startY = startY ?? ctx.canvas.height / 2;
//     this.endX = endX ?? 0;
//     this.endY = endY ?? ctx.canvas.height / 2;
//     this.controlX1 = controlX1 ?? ctx.canvas.width * 0.75;
//     this.controlY1 = controlY1 ?? ctx.canvas.height * 0.25;
//     this.controlX2 = controlX2 ?? ctx.canvas.width * 0.25;
//     this.controlY2 = controlY2 ?? ctx.canvas.height * 0.75;

//     this.speed = speed;
//   }

//   draw() {
//     this.ctx.beginPath();
//     this.ctx.fillStyle = this.c;
//     this.ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
//     this.ctx.fill();
//   }

//   animate() {
//     if (this.t <= 1) {
//       // Calculate the next position based on the Bezier curve
//       this.x = this.calculateBezierPoint(
//         this.t,
//         this.startX,
//         this.controlX1,
//         this.controlX2,
//         this.endX
//       );
//       this.y = this.calculateBezierPoint(
//         this.t,
//         this.startY,
//         this.controlY1,
//         this.controlY2,
//         this.endY
//       );
//       this.t += this.speed; // Increment the parameter to move along the path
//     }
//     this.draw();
//   }

//   calculateBezierPoint(
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

//   getPosition(): { x: number; y: number } {
//     return { x: this.x, y: this.y };
//   }
// }

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

  return {
    draw,
    animate,
    getPosition,
  };
}

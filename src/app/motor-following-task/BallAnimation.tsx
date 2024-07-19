import React, { useEffect, useRef } from "react";

interface SineWaveProps {
  width: number;
  height: number;
  handleAllCoordinateUpdate: any;
}

const BallAnimation: React.FC<SineWaveProps> = ({
  width,
  height,
  handleAllCoordinateUpdate,
}) => {
  const pathRef = useRef<SVGPathElement>(null);
  const ballRef = useRef<SVGCircleElement>(null);

  const sineWaveFunction = (x: number): number => {
    return 2 * Math.sin(x) + 1.5 * Math.sin(1.8 * x);
  };

  useEffect(() => {
    const updateRate = 10; // animation rate set to 20 millisecond
    if (!pathRef.current || !ballRef.current) return;
    const path = pathRef.current;
    const ball = ballRef.current;

    let pathData = `M 0 ${height / 2}`;

    for (let x = 0; x < width; x++) {
      const y = height / 2 + 50 * sineWaveFunction(x * 0.02); // Adjust amplitude for visibility
      pathData += ` L ${x} ${y}`;
    }

    path.setAttribute("d", pathData);

    const duration = 20000;
    let startTime: number | null = null;

    const animateBall = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      // console.log({ timestamp, elapsed, startTime });
      const progress = elapsed / duration;

      if (progress >= 1) {
        const length = path.getTotalLength();
        const finalPoint = path.getPointAtLength(length);
        ball.setAttribute("cx", finalPoint.x.toString());
        ball.setAttribute("cy", finalPoint.y.toString());
        return;
      }

      const length = path.getTotalLength();
      const point = path.getPointAtLength(progress * length);
      ball.setAttribute("cx", point.x.toString());
      ball.setAttribute("cy", point.y.toString());

      // Check to log at every 20 milliseconds
      handleAllCoordinateUpdate({
        time: `${elapsed.toFixed(2)}ms`,
        objX: point.x.toFixed(2),
        objY: point.y.toFixed(2),
        touchX: 0,
        touchY: 0,
      });

      requestAnimationFrame(animateBall);
      // didn't work, working at default rate only
      // setTimeout(() => {
      //   requestAnimationFrame(animateBall);
      // }, updateRate);
    };

    requestAnimationFrame(animateBall);
  }, [width, height]);

  return (
    <svg width="100%" height={height}>
      <path
        ref={pathRef}
        id="sineWave"
        stroke="#3498db"
        strokeWidth="2"
        fill="transparent"
      />
      <circle ref={ballRef} id="ball" cx="0" cy="0" r="25" fill="red" />
    </svg>
  );
};

export default BallAnimation;

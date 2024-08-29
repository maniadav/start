"use client";
import React, { useEffect, useRef } from "react";
import { useMotorStateContext } from "state/provider/MotorStateProvider";
import { Coordinate } from "types/survey.types";

interface BallAnimationProp {
  width: number;
  height: number;
  attempt: number;
}

const BallAnimation: React.FC<BallAnimationProp> = ({
  width,
  height,
  attempt,
}) => {
  const pathRef = useRef<SVGPathElement>(null);
  const ballRef = useRef<SVGCircleElement>(null);

  // context to handle ball and touch movement
  const { setBallCoordinates } = useMotorStateContext();

  // modify to update the ball path
  const sineWaveFunction = (x: number): number => {
    const frequency = 1 + attempt * 0.5;
    const wavelengthFactor = 0.3; // Increase wavelength (0 < wavelengthFactor < 1)
    return (
      1.5 *
      (Math.sin(frequency * wavelengthFactor * x) +
        Math.sin(1.8 * wavelengthFactor * x))
    );
  };

  // Cubic easing function for the progress
  const cubicEaseInOut = (t: number) => {
    const frequency = 2;
    const amplitude = 0.5;

    //starting slow and then speeding up and slowing down periodically
    return (
      (1 - Math.cos(t * Math.PI * frequency)) * amplitude + (1 - amplitude) * t
    );
  };

  useEffect(() => {
    if (!pathRef.current || !ballRef.current) return;
    const path = pathRef.current;
    const ball = ballRef.current;

    let pathData = `M 0 ${height / 2}`;

    for (let x = 0; x < width; x++) {
      const y = height / 2 + 100 * sineWaveFunction(x * 0.02); // Adjust amplitude for visibility
      pathData += ` L ${x} ${y}`;
    }

    path.setAttribute("d", pathData);

    const duration = 60000; // 1 min, ball movement time
    let startTime: number | null = null;

    const animateBall = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const rawProgress = elapsed / duration;

      // Apply cubic easing to the progress
      const progress = cubicEaseInOut(rawProgress);

      if (progress >= 1) {
        const length = path.getTotalLength();
        const finalPoint = path.getPointAtLength(length);
        ball.setAttribute("cx", finalPoint.x.toString());
        ball.setAttribute("cy", finalPoint.y.toString());
        return;
      }

      const length = path.getTotalLength();
      const point = path.getPointAtLength(Math.min(progress, 1) * length);
      ball.setAttribute("cx", point.x.toString());
      ball.setAttribute("cy", point.y.toString());

      setBallCoordinates((prevPoints: Coordinate[]) => [
        ...(prevPoints || []),
        {
          x: Number(point.x.toFixed(2)),
          y: Number(point.y.toFixed(2)),
        },
      ]);

      requestAnimationFrame(animateBall);
    };

    requestAnimationFrame(animateBall);
  }, [width, height]);

  return (
    <svg width="100%" height={height}>
      <path
        ref={pathRef}
        id="sineWave"
        // stroke="#3498db"
        strokeWidth="2"
        fill="transparent"
      />
      <circle ref={ballRef} id="ball" cx="0" cy="0" r="25" fill="red" />
    </svg>
  );
};

export default BallAnimation;

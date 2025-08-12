import { useEffect, useState, useCallback, memo } from "react";

interface ProgressiveCircleProps {
  handleCircleComplete: () => void;
  durationMs?: number;
}

const ProgressiveCircle = ({
  handleCircleComplete,
  durationMs = 3000, // Default to 30 seconds
}: ProgressiveCircleProps) => {
  const [progress, setProgress] = useState(0);

  // Use useCallback to ensure the interval function doesn't change between renders
  const updateProgress = useCallback(() => {
    setProgress((prev) => {
      if (prev >= 100) {
        handleCircleComplete();
        return 100;
      }
      return prev + 1;
    });
  }, [handleCircleComplete]);

  useEffect(() => {
    // Calculate interval to update progress in small steps for smooth animation
    const totalSteps = 100;
    const intervalMs = durationMs / totalSteps; // Divide total duration by steps for even progression

    const interval = setInterval(updateProgress, intervalMs);

    return () => clearInterval(interval);
  }, [updateProgress, durationMs]);

  // Optimize the style calculation
  const backgroundStyle = `conic-gradient(#941212 ${progress}%, #dedee2 ${progress}%)`;

  return (
    <div className="w-52 h-52 rounded-full relative flex items-center justify-center shadow-xl border border-gray-300">
      <div
        className="absolute inset-0 rounded-full z-40"
        style={{ background: backgroundStyle }}
      />
      <div className="w-44 h-44 bg-gray-100 rounded-full z-50 border border-gray-300" />
    </div>
  );
};

// Memoize the component to prevent unnecessary re-renders
export default memo(ProgressiveCircle);

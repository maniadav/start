'use client';
import React, { useEffect, useState } from 'react';
import ErrorComponent from './common/ErrorComponent';

const GameWrapper = ({ children }: any) => {
  const [isLandscape, setIsLandscape] = useState(true);
  const [isUpsideDown, setIsUpsideDown] = useState(false);

  // Check for orientation changes
  useEffect(() => {
    const handleOrientationChange = () => {
      // Detect orientation using the Screen Orientation API if available
      if (screen.orientation) {
        const { type } = screen.orientation;
        if (type === 'portrait-secondary') {
          setIsUpsideDown(true); // Screen is upside down
          setIsLandscape(false);
        } else if (type.startsWith('landscape')) {
          setIsLandscape(true);
          setIsUpsideDown(false);
        } else {
          setIsLandscape(false);
          setIsUpsideDown(false);
        }
      } else {
        // Fallback using window dimensions
        if (window.innerWidth > window.innerHeight) {
          setIsLandscape(true);
          setIsUpsideDown(false);
        } else {
          setIsLandscape(false);
          setIsUpsideDown(window.orientation === 180); // Deprecated, fallback logic
        }
      }
    };

    // Listen for orientation changes
    window.addEventListener('resize', handleOrientationChange);
    screen.orientation?.addEventListener('change', handleOrientationChange);

    // Initial check
    handleOrientationChange();

    return () => {
      window.removeEventListener('resize', handleOrientationChange);
      screen.orientation?.removeEventListener(
        'change',
        handleOrientationChange
      );
    };
  }, []);

  // Check for screen resize to handle window dimension changes
  const [initialWidth, setInitialWidth] = useState(0);
  const [isWindowWide, setIsWindowWide] = useState(true);

  useEffect(() => {
    setInitialWidth(window.innerWidth);

    const checkWindowSize = () => {
      const currentWidth = window.innerWidth;
      setIsWindowWide(currentWidth >= initialWidth);
    };

    window.addEventListener('resize', checkWindowSize);
    checkWindowSize();

    return () => window.removeEventListener('resize', checkWindowSize);
  }, [initialWidth]);

  return (
    <div>
      {isUpsideDown ? (
        <ErrorComponent
          imageUrl={'/image/upside-down.png'}
          title={'Device is upside down!'}
          subTitle={
            'Please rotate your device to the correct orientation to continue using the application.'
          }
        />
      ) : isLandscape ? (
        isWindowWide ? (
          <div className="w-full overflow-hidden m-0">{children}</div>
        ) : (
          <ErrorComponent
            imageUrl={'/image/restrict.jpg'}
            title={'Uh-oh! Something went off-screen...'}
            subTitle={
              'It looks like resizing the window caused this issue. Please restore the screen to its recommended size or visit the homepage to continue exploring.'
            }
          />
        )
      ) : (
        <ErrorComponent
          imageUrl={'/image/sadcat.png'}
          title={"Oops! Looks like your device dimensions aren't compatible"}
          subTitle={
            'Please rotate your device to portrait mode to continue using the application.'
          }
        />
      )}
    </div>
  );
};

export default GameWrapper;

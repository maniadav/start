import { useEffect, useRef } from 'react';

interface FullScreenWrapperProps {
  isFullScreen: boolean;
  children: React.ReactNode;
}

const FullScreenWrapper: React.FC<FullScreenWrapperProps> = ({
  isFullScreen,
  children,
}) => {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isFullScreen) {
      enterFullScreen();
    } else {
      exitFullScreen(); 
    }
  }, [isFullScreen]);

  const enterFullScreen = async () => {
    try {
      if (elementRef.current) {
        const elem = elementRef.current as HTMLElement;
        if (elem.requestFullscreen) {
          await elem.requestFullscreen();
        } else if ((elem as any).mozRequestFullScreen) {
          // Firefox
          await (elem as any).mozRequestFullScreen();
        } else if ((elem as any).webkitRequestFullscreen) {
          // Chrome, Safari, Opera
          await (elem as any).webkitRequestFullscreen();
        } else if ((elem as any).msRequestFullscreen) {
          // IE/Edge
          await (elem as any).msRequestFullscreen();
        }
      }
    } catch (error) {
      console.error('Error trying to enter fullscreen mode:', error);
    }
  };

  const exitFullScreen = async () => {
    try {
      if (document.fullscreenElement) {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if ((document as any).mozCancelFullScreen) {
          // Firefox
          await (document as any).mozCancelFullScreen();
        } else if ((document as any).webkitExitFullscreen) {
          // Chrome, Safari, Opera
          await (document as any).webkitExitFullscreen();
        } else if ((document as any).msExitFullscreen) {
          // IE/Edge
          await (document as any).msExitFullscreen();
        }
      }
    } catch (error) {
      console.error('Error trying to exit fullscreen mode:', error);
    }
  };

  return (
    <div
      ref={elementRef}
      style={{ height: '100vh', width: '100vw', backgroundColor: '#f0f0f0' }}
    >
      {children}
    </div>
  );
};

export default FullScreenWrapper;

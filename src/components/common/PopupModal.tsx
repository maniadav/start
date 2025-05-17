interface IPopup {
  slideBottom?: boolean;
  slideTop?: boolean;
  slideRight?: boolean;
  slideLeft?: boolean;
  show: boolean;
  children?: any;
  onRequestClose?: () => void;
  customStyle?: any;
}

export const PopupModal = ({
  show,
  children,
  onRequestClose,
  slideBottom = false,
  slideTop = false,
  slideRight = false,
  slideLeft = false,
  customStyle,
}: IPopup) => {
  // Compute slide classes
  const getSlideClass = () => {
    if (slideRight) return show ? "translate-x-0" : "translate-x-full";
    if (slideLeft) return show ? "translate-x-0" : "-translate-x-full";
    if (slideBottom) return show ? "translate-y-0" : "translate-y-full";
    if (slideTop) return show ? "translate-y-0" : "-translate-y-full";
    return "";
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className={`inset-0 fixed w-screen h-screen z-[9999] bg-black bg-opacity-60 transition-all duration-500 ease-linear flex items-center justify-center ${
        show
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
      style={{ pointerEvents: show ? "auto" : "none" }}
      onClick={() => onRequestClose && onRequestClose()}
    >
      <div
        className={`relative transition-transform duration-500 ease-linear w-full h-full ${getSlideClass()} ${
          customStyle || ""
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

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
  return (
    <div
      className={`${
        show
          ? `inset-0 fixed w-screen  h-screen ease-linear transform transition duration-500 z-50 right-0 top-0 bg-opacity-[0.6] bg-black opacity-100`
          : `inset-0 fixed w-screen  h-screen ease-linear transform transition duration-500 z-50 right-0 top-0 bg-opacity-[0.6] bg-transparent opacity-0
          ${slideRight && "translate-x-full"} 
          ${slideLeft && "-translate-x-full"}
          ${slideBottom && "translate-y-full"}
          ${slideTop && "-translate-y-full"}`
      }`}
      onClick={() => onRequestClose && onRequestClose()}
    >
      <div
        className={`${customStyle} relative w-full h-full`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

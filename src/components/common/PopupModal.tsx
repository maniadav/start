interface IPopup {
  show: boolean;
  children: any;
  onRequestClose?: () => void;
}

const PopupModal = ({ show, children, onRequestClose }: IPopup) => {
  return (
    <div className={`${show ? "show" : "hidden"}`}>
      <div
        className="z-50 inset-0 fixed bg-black bg-opacity-[0.6]"
        onClick={() => onRequestClose && onRequestClose()}
      >
        <div
          className="relative w-full h-full overflow-y-scroll"
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default PopupModal;

interface IPopup2 {
  slideBottom?: boolean;
  slideTop?: boolean;
  slideRight?: boolean;
  slideLeft?: boolean;
  show: boolean;
  children?: any;
  onRequestClose?: () => void;
  customStyle?: any;
}

export const PopupModal2 = ({
  show,
  children,
  onRequestClose,
  slideBottom = false,
  slideTop = false,
  slideRight = false,
  slideLeft = false,
  customStyle,
}: IPopup2) => {
  return (
    <div
      className={`${
        show
          ? `inset-0 fixed w-full  h-full ease-linear transform transition duration-500 z-50 right-0 top-0 bg-opacity-[0.6] bg-black opacity-100`
          : `inset-0 fixed w-full  h-full ease-linear transform transition duration-500 z-50 right-0 top-0 bg-opacity-[0.6] bg-transparent opacity-0
          ${slideRight && "translate-x-full"} 
          ${slideLeft && "-translate-x-full"}
          ${slideBottom && "translate-y-full"}
          ${slideTop && "-translate-y-full"}`
      }`}
      onClick={() => onRequestClose && onRequestClose()}
    >
      <div
        className={`${customStyle} relative `}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

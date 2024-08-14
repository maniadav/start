import CommonIcon from "./CommonIcon";
import clsx from "clsx";
interface buttonPropsType {
  labelText?: string;
  bgWhite?: boolean;
  hoverLightPink?: boolean;
  btnIcon?: any;
  btnType?: any;
  textBtn?: boolean;
  isDisabled?: boolean;
  customClass?: any;
  clicked: (clicked: any) => any;
}

export function CommonButton({
  labelText,
  bgWhite = false,
  hoverLightPink = false,
  btnIcon,
  btnType = "button",
  isDisabled = false,
  textBtn = false,
  customClass,
  clicked,
}: buttonPropsType) {
  return (
    <button
      type={btnType}
      className={clsx(
        `whitespace-nowrap ${customClass} ${
          textBtn && "w-full bg-0 border-0"
        } p-2 md:py-2.5 md:px-3 border border-solid rounded text-xs md:text-sm capitalize cursor-pointer inline-flex items-center transition ease-in-out delay-50`,
        `${
          bgWhite
            ? ` bg-white  ${
                isDisabled && "hover:bg-white hover:text-primary"
              }           ${
                hoverLightPink
                  ? `text-[#212529] border-[#dee2e6] hover:text-primary hover:bg-secondary hover:border-secondary`
                  : "border-primary text-primary hover:bg-primary hover:text-white"
              }`
            : `bg-primary text-white`
        }`,
        `${isDisabled && "opacity-60 cursor-not-allowed"} `
      )}
      onClick={() => {
        clicked(true);
      }}
      disabled={isDisabled}
    >
      <CommonIcon icon={btnIcon} width={26} height={26} />
      {labelText && (
        <span className={`${btnIcon ? " ml-1 mt-0.5" : "no-wrap"}`}>
          {labelText}
        </span>
      )}
      {/* <div className="whitespace-nowrap p-2 md:py-2.5 md:px-3 border border-solid rounded text-xs md:text-sm capitalize cursor-pointer inline-flex items-center transition ease-in-out delay-50 bg-primary text-white">
      {labelText}
      </div> */}
    </button>
  );
}
export function CommonButton2({
  labelText,
  bgWhite = false,
  hoverLightPink = false,
  btnIcon,
  btnType = "button",
  isDisabled = false,
  textBtn = false,
  customClass,
  clicked,
}: buttonPropsType) {
  return (
    <button
      type={btnType}
      className={clsx(
        `${customClass} ${
          textBtn && "bg-0 border-0"
        } p-2 md:py-2.5 md:px-3 border border-solid rounded text-xs md:text-sm capitalize cursor-pointer inline-flex items-center transition ease-in-out delay-50`,
        `${
          bgWhite
            ? ` bg-white  ${
                isDisabled && "hover:bg-white hover:text-primary"
              }           ${
                hoverLightPink
                  ? `text-[#212529] border-[#dee2e6] hover:text-primary hover:bg-secondary hover:border-secondary`
                  : "border-primary text-primary hover:bg-primary hover:text-white"
              }`
            : `bg-primary text-white`
        }`,
        `${isDisabled && "opacity-60 cursor-not-allowed"} `
      )}
      onClick={() => {
        clicked(true);
      }}
      disabled={isDisabled}
    >
      <span
        className={`${!bgWhite ? "text-[#ffffff]" : "text-primary"}`}
      ></span>
      <CommonIcon icon={btnIcon} width={16} height={16} />
      <span className={`${btnIcon && " ml-1 mt-0.5"}`}>{labelText}</span>
    </button>
  );
}

export function CommonButtonText({
  labelText,
  bgWhite = false,
  hoverLightPink = false,
  btnIcon,
  btnType = "button",
  isDisabled = false,
  textBtn = false,
  customClass,
  clicked,
}: buttonPropsType) {
  return (
    <button
      type={btnType}
      className={clsx(
        `${customClass} p-2 md:py-2.5 md:px-3 rounded text-xs md:text-sm capitalize cursor-pointer inline-flex items-center transition ease-in-out delay-50`,
        `${isDisabled && "opacity-60 cursor-not-allowed"} `
      )}
      onClick={() => {
        clicked(true);
      }}
      disabled={isDisabled}
    >
      <span
        className={`${!bgWhite ? "text-[#ffffff]" : "text-primary"}`}
      ></span>
      <CommonIcon icon={btnIcon} width={16} height={16} />
      <span className={`${btnIcon && " ml-1 mt-0.5"}`}>{labelText}</span>
    </button>
  );
}

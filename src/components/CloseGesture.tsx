import { useState, useEffect } from "react";

const CloseGesture = ({ handlePressAction }: any) => {
  const [firstButtonPressed, setFirstButtonPressed] = useState<
    null | "top" | "bottom"
  >(null);

  const handleButtonPress = (button: "top" | "bottom") => {
    if (firstButtonPressed && firstButtonPressed !== button) {
      handlePressAction();
      setFirstButtonPressed(null);
    } else {
      setFirstButtonPressed(button);

      setTimeout(() => {
        setFirstButtonPressed(null);
      }, 5000);
    }
  };
  console.log({ firstButtonPressed });

  return (
    <div>
      <div
        className="z-50 fixed right-0 top-0 p-3 cursor-pointer w-16 h-16 "
        onClick={() => handleButtonPress("top")}
      ></div>
      <div
        className="z-50 fixed right-0 bottom-0 p-3 cursor-pointer w-16 h-16"
        onClick={() => handleButtonPress("bottom")}
      ></div>
    </div>
  );
};

export default CloseGesture;

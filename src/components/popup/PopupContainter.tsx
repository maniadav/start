import React from "react";

const PopupContainter = ({ children }: any) => {
  return (
    <div className="fixed right-0 top-0 inset-0 w-full h-full flex items-center justify-center overflow-y-auto bg-black bg-opacity-80 backdrop-blur-sm z-[1000]">
      <div className="relative p-4 w-full max-w-xl max-h-full">{children}</div>
    </div>
  );
};

export default PopupContainter;

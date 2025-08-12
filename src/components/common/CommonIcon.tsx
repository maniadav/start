import React from "react";
import { Icon } from "@iconify/react";
interface iconPropsType {
  icon: string; // https://icon-sets.iconify.design/ for finding icons
  width?: number;
  height?: number;
  flip?: "horizontal" | "vertical";
  rotate?: any;
  click?: (click: any) => any;
}

const CommonIcon = ({
  icon,
  width,
  height,
  flip,
  rotate,
  click,
}: iconPropsType) => {
  return (
    <Icon
      icon={icon}
      height={height || 24}
      width={width || 24}
      flip={flip}
      rotate={rotate}
      onClick={() => {
        click && click(true);
      }}
    />
  );
};

export default CommonIcon;

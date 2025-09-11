import * as React from "react";

interface SlotProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
}

const Slot = React.forwardRef<HTMLElement, SlotProps>(
  ({ children, ...props }, ref) => {
    if (React.isValidElement(children)) {
      return React.cloneElement(children, {
        ...props,
        ...children.props,
        ref: ref,
        className: [props.className, children.props.className]
          .filter(Boolean)
          .join(" ") || undefined,
      });
    }

    if (React.Children.count(children) > 1) {
      React.Children.only(null); // Throws error for multiple children
    }

    return <span ref={ref} {...props}>{children}</span>;
  }
);

Slot.displayName = "Slot";

export { Slot };

import type React from "react";

interface ButtonProps {
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
}

const Button = ({
  variant = "default",
  size = "md",
  disabled = false,
  onClick,
  className = "",
  children,
}: ButtonProps) => {
  const baseStyles =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

  const variantStyles = {
    default: "bg-black text-white",
    outline:
      "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    ghost: "hover:bg-accent hover:text-accent-foreground",
  };

  const sizeStyles = {
    sm: "h-9 px-3 text-sm",
    md: "h-10 px-4 py-2",
    lg: "h-11 px-8 text-lg",
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;

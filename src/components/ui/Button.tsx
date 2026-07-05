import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "nav-signup" | "nav-login" | "nav-ai";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  fullWidth = false,
  className = "",
  children,
  ...props
}) => {
  // Base classes
  let baseStyle = "inline-flex items-center justify-center font-medium transition-all duration-150 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";
  
  // Variant styling mapping
  let variantStyle = "";
  switch (variant) {
    case "primary":
      variantStyle = "bg-primary text-on-primary hover:bg-neutral-800 dark:hover:bg-neutral-200 active:scale-98 shadow-sm";
      break;
    case "secondary":
      variantStyle = "bg-canvas text-ink border border-hairline hover:bg-canvas-soft-2 hover:border-hairline-strong active:scale-98";
      break;
    case "ghost":
      variantStyle = "bg-transparent text-body hover:text-ink hover:bg-canvas-soft-2";
      break;
    case "danger":
      variantStyle = "bg-error text-white hover:bg-error-deep active:scale-98";
      break;
    case "nav-signup":
      variantStyle = "bg-primary text-on-primary hover:bg-neutral-800 dark:hover:bg-neutral-200 text-xs font-semibold rounded-sm h-[28px] px-3 active:scale-95";
      break;
    case "nav-login":
      variantStyle = "bg-canvas text-ink text-xs font-semibold hover:bg-canvas-soft-2 h-[28px] px-3 active:scale-95";
      break;
    case "nav-ai":
      variantStyle = "bg-canvas text-ink border border-hairline text-xs font-semibold hover:bg-canvas-soft-2 h-[28px] px-3 active:scale-95";
      break;
  }

  // Size styling mapping
  let sizeStyle = "";
  if (variant !== "nav-signup" && variant !== "nav-login" && variant !== "nav-ai") {
    switch (size) {
      case "sm":
        sizeStyle = "text-xs h-8 px-3 rounded-sm";
        break;
      case "md":
        sizeStyle = "text-sm h-10 px-4 rounded-sm"; // standard in-app buttons
        break;
      case "lg":
        sizeStyle = "text-base h-12 px-6 rounded-pill"; // marketing buttons
        break;
    }
  }

  const widthStyle = fullWidth ? "w-full" : "";

  return (
    <button
      className={`${baseStyle} ${variantStyle} ${sizeStyle} ${widthStyle} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
export default Button;

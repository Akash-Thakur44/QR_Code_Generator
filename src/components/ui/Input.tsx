import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  inputSize?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, inputSize = "md", fullWidth = true, className = "", ...props }, ref) => {
    let sizeStyle = "";
    switch (inputSize) {
      case "sm":
        sizeStyle = "h-8 text-xs px-3 rounded-sm"; // height 32px
        break;
      case "md":
        sizeStyle = "h-10 text-sm px-3 rounded-sm"; // height 40px
        break;
      case "lg":
        sizeStyle = "h-12 text-base px-4 rounded-sm"; // height 48px
        break;
    }

    const borderStyle = error
      ? "border-error focus:border-error focus:ring-1 focus:ring-error"
      : "border-hairline focus:border-hairline-strong focus:ring-1 focus:ring-primary";

    const widthStyle = fullWidth ? "w-full" : "";

    return (
      <div className={`flex flex-col gap-1.5 ${widthStyle} ${className}`}>
        {label && (
          <label className="text-xs font-mono uppercase tracking-wider text-body">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`bg-canvas text-ink border transition-all duration-150 outline-none placeholder:text-mute font-sans ${sizeStyle} ${borderStyle} ${widthStyle}`}
          {...props}
        />
        {error && <span className="text-xs text-error font-medium">{error}</span>}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;

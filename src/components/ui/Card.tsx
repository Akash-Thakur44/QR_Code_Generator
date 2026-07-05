import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  level?: 1 | 2 | 3 | 4 | 5;
  rounded?: "sm" | "md" | "lg" | "xl";
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  level = 2,
  rounded = "md",
  hoverEffect = false,
  className = "",
  children,
  ...props
}) => {
  // Border radius mapping
  let roundedStyle = "";
  switch (rounded) {
    case "sm":
      roundedStyle = "rounded-sm"; // 6px
      break;
    case "md":
      roundedStyle = "rounded-md"; // 8px
      break;
    case "lg":
      roundedStyle = "rounded-lg"; // 12px
      break;
    case "xl":
      roundedStyle = "rounded-xl"; // 16px
      break;
  }

  // Shadow levels (defined in global.css as utilities)
  const shadowStyle = `shadow-level-${level}`;

  // Hover transitions
  const hoverStyle = hoverEffect
    ? "transition-all duration-200 hover:scale-[1.01] hover:shadow-level-3 hover:border-hairline-strong cursor-pointer"
    : "";

  return (
    <div
      className={`bg-canvas text-ink border border-hairline ${roundedStyle} ${shadowStyle} ${hoverStyle} p-6 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
export default Card;

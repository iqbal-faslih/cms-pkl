import React from "react";

const Badge2 = ({
  children,
  color = "#0D5EF4",
  textColor = "#FFFFFF",
  textSize = "0.875rem", // default = text-sm
  rounded = "0.5rem", // default = rounded-lg
  px = "16px",
  py = "4px",
  className,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`flex justify-center items-center font-medium ${className || ""}`}
      style={{
        backgroundColor: color,
        paddingLeft: px,
        paddingRight: px,
        paddingTop: py,
        paddingBottom: py,
        color: textColor,
        fontSize: textSize,
        borderRadius: rounded,
      }}
    >
      {children}
    </div>
  );
};

export default Badge2;

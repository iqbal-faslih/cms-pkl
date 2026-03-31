import React from "react";

const Checkbox = ({
  label,
  checked,
  onChange,
  disabled = false,

  size = 18,
  className = "",
  boxClass = "",            // khusus box-nya
  checkIconClass = "",      // khusus icon
}) => {
  const checkboxElement = (
    <div
      onClick={disabled ? undefined : onChange}
      data-checked={checked}
      className={`
        flex items-center justify-center transition-all duration-150
        border-2 ${checked ? "border-blue-500" : "border-blue-500"} rounded
        ${checked ? "bg-blue-500" : "bg-white"}
        ${disabled ? "opacity-40 cursor-not-allowed" : "hover:bg-blue-200 cursor-pointer"}
        ${boxClass}
      `}
      style={{
        width: size,
        height: size,
      }}
    >
      {checked && (
        <svg
          className={checkIconClass || "text-white"}
          width={size - 6}
          height={size - 6}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      )}
    </div>
  );

  if (label) {
    return (
      <label
        className={`flex items-center gap-2 ${disabled ? "cursor-not-allowed" : "cursor-pointer"} ${className}`}
      >
        {checkboxElement}
        <span className="text-sm">{label}</span>
      </label>
    );
  }

  return checkboxElement;
};

export default Checkbox;

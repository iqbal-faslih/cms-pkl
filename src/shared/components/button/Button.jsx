import React from "react";
import { Loader2 } from "lucide-react";

const Button = ({
  children,
  onClick,
  type = "button",
  className = "",
  loading = false,
  loadingText = "Loading...",
  disabled = false,
  label = "Button",
  iconLeft = null,
  iconRight = null,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        flex items-center justify-center gap-2 font-medium
        transition-all duration-150 ease-in-out
        ${disabled || loading ? "opacity-70 cursor-not-allowed" : "hover:opacity-90"}
        ${className}
      `}
    >
      {loading ? (
        <>
          <Loader2 className="animate-spin w-5 h-5" />
          <span>{loadingText}</span>
        </>
      ) : (
        <>
          {iconLeft && <span className="flex items-center">{iconLeft}</span>}
          {children || <span>{label}</span>}
          {iconRight && <span className="flex items-center">{iconRight}</span>}
        </>
      )}
    </button>
  );
};

export default Button;

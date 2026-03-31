import React from "react";

const FloatingLabelInput = React.forwardRef(
  (
    {
      label,
      type = "text",
      placeholder,
      icon,
      error,
      showPasswordToggle = false,
      showPassword,
      onTogglePassword,
      ...rest
    },
    ref
  ) => {
    const inputId = label.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="relative w-full mb-4">
        <label
          htmlFor={inputId}
          className="block mb-2 font-medium text-sm text-gray-800"
        >
          {label}
        </label>

        <div className="relative">
          {icon && (
            <span className="absolute inset-y-0 left-0 pl-3 flex font-medium text-xl items-center text-gray-400 pointer-events-none">
              <i className={`bi ${icon}`} />
            </span>
          )}

          <input
            id={inputId}
            ref={ref}
            type={showPassword ? "text" : type}
            placeholder={placeholder}
            {...rest}
            className={`w-full bg-white rounded-lg border py-3 text-sm ${
              icon ? "pl-10" : "px-4"
            } pr-4 focus:outline-none focus:ring-2 ${
              error
                ? "border-red-500 focus:ring-red-400"
                : "border-slate-300/[0.8] focus:ring-blue-500"
            }`}
          />

          {showPasswordToggle && (
            <button
              type="button"
              onClick={onTogglePassword}
              className="absolute inset-y-0 right-3 flex items-center text-gray-400"
            >
              <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`} />
            </button>
          )}
        </div>

        {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
      </div>
    );
  }
);

export default FloatingLabelInput;

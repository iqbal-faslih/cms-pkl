import { IoEyeOff, IoEye, IoAlertCircleOutline } from "react-icons/io5";
import SelectField from "./SelectField";
import { useState } from "react";

const InputField = ({
  label,
  required = false,
  hideLabel = false,
  type = "text",
  value,
  onChange,
  name,
  placeholder,
  error,
  readonly = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const allowedTypes = ["text", "number", "email", "password"];
  if (!allowedTypes.includes(type)) {
    console.warn(
      `InputField: type "${type}" tidak diizinkan. Gunakan FileInput, SelectField, atau RadioGroup.`
    );
    return null;
  }

  const inputType = type === "password" && showPassword ? "text" : type;

  return (
    <div className={`${hideLabel ? "" : "mb-4"}`}>
      {label && !hideLabel && (
        <label htmlFor={name} className="block font-medium mb-1 text-black">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          type={inputType}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          readOnly={readonly}
          className={`w-full h-10 rounded-lg border border-gray-300 text-gray-700 placeholder:text-[#9C9C9C] px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-active
            ${error ? "border-red-500" : ""}
          `}
        />

        {type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <IoEye size={18} /> : <IoEyeOff size={18} />}
          </button>
        )}
      </div>
      {error && (
        <div className="mt-1 flex items-center text-red-500 text-sm gap-1">
          <IoAlertCircleOutline size={15} /> {error}
        </div>
      )}
    </div>
  );
};

export default InputField;

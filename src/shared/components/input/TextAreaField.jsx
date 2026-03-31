import { IoAlertCircleOutline } from "react-icons/io5";

const TextareaField = ({
  label,
  required = false,
  value,
  onChange,
  name,
  placeholder,
  error,
  readonly = false,
  rows = 4,
}) => {
  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={name} className="block font-medium mb-1 text-black">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        readOnly={readonly}
        rows={rows}
        className={`w-full rounded-lg border border-gray-300 text-gray-700 placeholder:text-[#9C9C9C] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-active
          ${error ? "border-red-500" : ""}
        `}
      />
      
      {error && (
        <div className="mt-1 flex items-center text-red-500 text-sm gap-1">
          <IoAlertCircleOutline size={15} /> {error}
        </div>
      )}

    </div>
  );
};

export default TextareaField;

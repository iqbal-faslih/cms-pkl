import { Eye, EyeOff } from "lucide-react";

const PasswordField = ({
  label,
  name,
  showPassword,
  onToggleVisibility,
  register,
  error,
  autoComplete = "off",
}) => {
  const inputId = `password-field-${name}`;

  return (
    <div className="mb-5">
      <label htmlFor={inputId} className="text-sm font-medium text-slate-800">
        {label}
      </label>
      <div className="relative mt-1.5 w-full">
        <input
          id={inputId}
          type={showPassword ? "text" : "password"}
          autoComplete={autoComplete}
          {...register(name)}
          className={`w-full rounded-lg border bg-white px-3 py-2.5 pr-11 text-sm text-slate-800 outline-none transition focus:ring-2 ${
            error
              ? "border-red-300 focus:border-red-400 focus:ring-red-100"
              : "border-slate-200 focus:border-blue-300 focus:ring-blue-100"
          }`}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${inputId}-error` : undefined}
        />
        <button
          type="button"
          onClick={onToggleVisibility}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
          aria-label={showPassword ? "Sembunyikan password" : "Lihat password"}
        >
          {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
        </button>
      </div>
      {error && (
        <p id={`${inputId}-error`} className="mt-1 text-xs text-red-500">
          {error.message}
        </p>
      )}
    </div>
  );
};

export default PasswordField;

const FormField = ({ field, register, error, className = "" }) => {
  const inputPaddingClass = "px-4";

  return (
    <div
      className={`${
        field.name === "alamat" ? "md:col-span-2" : ""
      } ${className}`}
    >
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        {field.type === "select" ? (
          <select
            {...register(field.name)}
            className={`w-full ${inputPaddingClass} py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
              error ? "border-red-500 focus:ring-red-500" : "border-gray-300"
            }`}
          >
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : field.type === "textarea" ? (
          <textarea
            {...register(field.name)}
            placeholder={field.placeholder}
            rows={field.rows || 3}
            className={`w-full ${inputPaddingClass} py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none ${
              error ? "border-red-500 focus:ring-red-500" : "border-gray-300"
            }`}
          />
        ) : (
          <input
            {...register(field.name)}
            type={field.type}
            placeholder={field.placeholder}
            maxLength={field.maxLength}
            max={field.max}
            autoComplete={field.autoComplete}
            className={`w-full ${inputPaddingClass} py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
              error ? "border-red-500 focus:ring-red-500" : "border-gray-300"
            }`}
          />
        )}
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
          <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
          {error}
        </p>
      )}
    </div>
  );
};

export default FormField;

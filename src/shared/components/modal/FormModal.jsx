import { useState, useEffect } from "react";
import InputField from "../input/InputField";
import SelectField from "../input/SelectField";
import TextareaField from "../input/TextAreaField";
import CalendarField from "../input/CalendarField";
import FileField from "../input/FileField";
import MultiSelect from "../input/MultiselectField";
import Button from "../button/Button";
import { FaFileLines } from "react-icons/fa6";
import { X } from "lucide-react";
import { Icon } from "@iconify/react";

export default function FormModal({
  open,
  onClose,
  onSubmit,
  title = "Form Title",
  customActions,
  subtitle,
  icon = "lineicons:flag-2",
  showIcon = true,
  showIconBackground = true,
  fields = [],
  initialValues = {},
  layout = [],
  actions = [],
  showClose = true,
}) {
  const [form, setForm] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (open) setForm({ ...initialValues });
  }, [open]);

  const handleChange = (name, value) => {
    if (value?.target?.files) value = value.target.files[0];
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    fields.forEach((f) => {
      if (f.required && !form[f.name])
        newErrors[f.name] = `${f.label} wajib diisi!`;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(form);
    onClose();
  };

  const handleScroll = (e) => setScrolled(e.target.scrollTop > 10);

  if (!open) return null;

  const renderLabel = (field) => (
    <span>
      {field.label}
      {field.required && <span className="text-red-500 ml-1">*</span>}
    </span>
  );

  const renderField = (field) => {
    if (typeof field.showWhen === "function") {
      if (!field.showWhen(form)) return null;
    }
    if (field.type === "custom") {
      return field.render(form, setForm, errors[field.name], errors);
    }

    switch (field.type) {
      case "select":
        return (
          <SelectField
            label={renderLabel(field)}
            name={field.name}
            value={form[field.name] || ""}
            options={field.options || []}
            placeholder={field.placeholder}
            onChange={(val) => handleChange(field.name, val)}
            error={errors[field.name]}
            readonly={field.readonly}
            disabled={field.disabled}
          />
        );

      case "multiselect":
        return (
          <MultiSelect
            label={renderLabel(field)}
            error={errors[field.name]}
            previewLabel={field.previewLabel}
            options={field.options || []}
            selectedItems={form[field.name] || []}
            placeholder={field.placeholder}
            required={field.required}
            readonly={field.readonly}
            onSelectionChange={(items) => handleChange(field.name, items)}
          />
        );

      case "textarea":
        return (
          <TextareaField
            label={renderLabel(field)}
            name={field.name}
            rows={field.rows || 4}
            value={form[field.name] || ""}
            placeholder={field.placeholder}
            onChange={(e) => handleChange(field.name, e.target.value)}
            error={errors[field.name]}
            required={field.required}
            readonly={field.readonly}
          />
        );

      case "file":
        return (
          <FileField
            label={renderLabel(field)}
            name={field.name}
            value={form[field.name]}
            required={field.required}
            onChange={(val) => handleChange(field.name, val)}
            error={errors[field.name]}
            showIcon={field.showIcon}
            readonly={field.readonly}
          />
        );

      case "calendar":
        return (
          <CalendarField
            label={renderLabel(field)}
            name={field.name}
            value={form[field.name] || ""}
            onChange={(e) => handleChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            error={errors[field.name]}
            readonly={field.readonly}
          />
        );

      default:
        return (
          <InputField
            label={renderLabel(field)}
            name={field.name}
            type={field.type}
            value={form[field.name] || ""}
            placeholder={field.placeholder}
            onChange={(e) => handleChange(field.name, e.target.value)}
            error={errors[field.name]}
            readonly={field.readonly}
          />
        );
    }
  };

  const renderWithLayout = () => {
    if (!layout.length)
      return (
        <div className="space-y-2">
          {fields.map((field) => renderField(field))}
        </div>
      );

    return (
      <div className="space-y-2">
        {layout.map((row, idx) => {
          const fullWidthRow = row.some((name) => {
            const f = fields.find((ff) => ff.name === name);
            return f?.fullWidth;
          });

          const colCount = fullWidthRow ? 1 : Math.min(row.length, 4);

          const colClassMap = {
            1: "grid-cols-1",
            2: "md:grid-cols-2",
            3: "md:grid-cols-3",
            4: "md:grid-cols-4",
          };

          return (
            <div key={idx} className={`grid gap-4 ${colClassMap[colCount]}`}>
              {row.map((fieldName) => {
                const field = fields.find((f) => f.name === fieldName);
                if (!field) return null;

                const colSpan =
                  field.fullWidth && colCount > 1 ? "md:col-span-full" : "";

                return (
                  <div key={fieldName} className={colSpan}>
                    {renderField(field)}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[700px] max-h-[90vh] flex flex-col overflow-hidden">
        {/* HEADER */}
        <div
          className={`flex flex-col gap-4 p-6 bg-white sticky top-0 z-20 transition-all ${
            scrolled ? "shadow-sm" : ""
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-x-4">
              {showIcon && (
                <div
                  className={`p-2 rounded-lg flex items-center justify-center ${
                    showIconBackground ? "bg-white border border-gray-200" : ""
                  }`}
                >
                  <Icon icon={icon} width={28} height={28} />
                </div>
              )}
              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  {title}
                </h2>
                {subtitle && (
                  <p className="text-sm text-slate-500 max-w-[500px]">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>
            {showClose && (
              <button
                type="button"
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600 transition"
              >
                <X size={24} />
              </button>
            )}
          </div>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          onScroll={handleScroll}
          className="flex-1 px-6 py-4 space-y-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
        >
          {renderWithLayout()}

            {customActions}

          {actions.length !== 0 && (
            <div className="flex justify-between gap-3 pt-4">
              {actions.map((btn, i) => (
                <Button
                  key={i}
                  type={btn.type || "button"}
                  className={btn.className}
                  onClick={btn.onClick}
                  loading={btn.loading}
                  disabled={btn.disabled}
                >
                  {btn.label}
                </Button>
              ))}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import InputField from "@/shared/components/input/InputField";
import SelectField from "@/shared/components/input/SelectField";
import TextareaField from "@/shared/components/input/TextAreaField";
import UploadFile from "@/shared/components/input/UploadFile";
import Button from "@/shared/components/button/Button";
import CalendarField from "@/shared/components/input/CalendarField";

const EMPTY_INITIAL_DATA = Object.freeze({});

const Form = React.forwardRef((props, ref) => {
  const {
    fields = [],
    initialData = EMPTY_INITIAL_DATA,
    layout = [],
    onSubmit,
    submitLoading,
    onCancel,
    submitStyle,
    cancelStyle,
    submitLabel,
    errors = {},
    showSubmitButton = true,
    onChange,
    showLabel = true,
    onSelectChange,
  } = props;

  const [form, setForm] = useState({});

  useEffect(() => {
    if (fields.length === 0) return;

    setForm((prev) => {
      let hasChanges = false;
      const next = { ...prev };
      fields.forEach((f) => {
        if (!(f.name in next)) {
          next[f.name] = initialData?.[f.name] ?? "";
          hasChanges = true;
        }
      });
      return hasChanges ? next : prev;
    });
  }, [fields, initialData]);

  const setVal = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    onChange?.(name, value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  const renderField = (field, showLabelHere = true) => {
    if (field.type === "custom") {
      return field.render(form, setForm);
    }

    switch (field.type) {
      case "input":
        return (
          <InputField
            key={field.name}
            label={showLabelHere ? field.label : ""}
            name={field.name}
            value={form[field.name]}
            onChange={(e) => setVal(field.name, e.target.value)}
            required={field.required}
            placeholder={field.placeholder}
            error={errors[field.name]}
            readonly={field.readonly}
          />
        );

      case "password":
        return (
          <InputField
            key={field.name}
            type="password"
            label={showLabelHere ? field.label : ""}
            name={field.name}
            value={form[field.name]}
            onChange={(e) => setVal(field.name, e.target.value)}
            required={field.required}
            placeholder={field.placeholder}
            error={errors[field.name]}
            readonly={field.readonly}
          />
        );

      case "textarea":
        return (
          <TextareaField
            key={field.name}
            label={showLabelHere ? field.label : ""}
            name={field.name}
            value={form[field.name]}
            onChange={(e) => setVal(field.name, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            error={errors[field.name]}
            readonly={field.readonly}
          />
        );

      case "select":
        return (
          <SelectField
            key={field.name}
            label={showLabelHere ? field.label : ""}
            name={field.name}
            value={form[field.name]}
            onChange={(val) => {
              setVal(field.name, val);
              onSelectChange?.[field.name]?.(val, setVal);
            }}
            options={field.options || []}
            required={field.required}
            disabled={field.disabled}
            placeholder={field.placeholder}
            error={errors[field.name]}
            isSearch={field.isSearch}
            multiple={field.multiple}
            loading={field.loading}
            loadingText={field.loadingText}
            onOpenChange={field.onOpenChange}
          />
        );

      case "file":
        return (
          <UploadFile
            key={field.name}
            label={showLabelHere ? field.label : ""}
            value={form[field.name]}
            onChange={(file) => setVal(field.name, file)}
            accept={field.accept || "*"}
            error={errors[field.name]}
            required={field.required}
            readonly={field.readonly}
          />
        );

      case "calendar":
        return (
          <CalendarField
            key={field.name}
            label={showLabelHere ? field.label : ""}
            name={field.name}
            value={form[field.name]}
            onChange={(e) => setVal(field.name, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            error={errors[field.name]}
            disabled={field.disabled}
          />
        );

      default:
        return null;
    }
  };

  return (
    <form ref={ref} onSubmit={handleSubmit} className="space-y-4">
      {layout.length > 0 ? (
        <div className="space-y-2">
          {layout.map((row, idx) => {
            const colCount = Math.min(row.length, 4);
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
                  return (
                    <div key={fieldName}>
                      {renderField(field, showLabel)}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-4">
          {fields.map((field) => renderField(field, showLabel))}
        </div>
      )}

      {showSubmitButton && (
        <div className="flex justify-end gap-2 mt-2">
          {onCancel && (
            <Button
              type="button"
              className={
                cancelStyle ||
                "text-gray-500 border border-slate-200 text-sm rounded-lg px-6 py-2"
              }
              onClick={onCancel}
            >
              Batal
            </Button>
          )}
          <Button
            type="submit"
            loading={submitLoading}
            className={
              submitStyle ||
              "bg-[#3E80F8] text-white hover:bg-blue-700 rounded-lg px-6 py-1 sm:px-6 sm:py-2 text-sm"
            }
          >
            {submitLabel || "Simpan"}
          </Button>
        </div>
      )}
    </form>
  );
});

export default Form;

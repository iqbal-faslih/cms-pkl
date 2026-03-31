export const buildAdminFieldsByMode = (fields = [], isEditing = false) =>
  fields.map((field) => ({
    ...field,
    readonly: !isEditing,
    required: !["password", "passwordBaru"].includes(field.name),
    label:
      field.name === "password"
        ? isEditing
          ? "Password Lama"
          : "Password"
        : field.label,
  }));

export const buildAdminLayoutByMode = (isEditing = false) =>
  isEditing
    ? [["nama", "email"], ["password", "passwordBaru"], ["nomorHp"]]
    : [["nama", "email"], ["", "nomorHp"]];

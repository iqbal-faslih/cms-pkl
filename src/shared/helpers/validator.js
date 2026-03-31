export const Validate = (schema, formData) => {
  const result = schema.safeParse(formData);

  if (result.success) return {};

  const errors = {};
  result.error.issues.forEach((issue) => {
    const field = issue.path[0];
    errors[field] = issue.message;
  });

  return errors;
};
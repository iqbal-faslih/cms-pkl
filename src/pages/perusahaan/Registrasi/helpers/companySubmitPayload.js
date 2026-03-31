const normalizeWebsite = (url) => {
  if (!url) return "";
  if (!/^https?:\/\//i.test(url)) return `https://${url}`;
  return url;
};

export const buildCompanySubmitPayload = (formData = {}) => {
  const payload = new FormData();
  const sourceEntries = Object.entries(formData).filter(
    ([, value]) => value !== null && value !== undefined
  );

  sourceEntries.forEach(([key, value]) => {
    if (value === null || value === undefined) return;

    if (key === "website") {
      payload.append("website", normalizeWebsite(value));
      return;
    }

    payload.append(key, value);
  });

  return payload;
};

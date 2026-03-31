// helpers/extractErrorMessage.js
export const extractErrorMessage = (err) => {
  const resData = err?.response?.data;

  if (Array.isArray(resData?.meta?.email) && resData.meta.email.length > 0) {
    return resData.meta.email[0];
  }

  if (Array.isArray(resData?.errors?.email) && resData.errors.email.length > 0) {
    return resData.errors.email[0];
  }

  return resData?.meta?.message || resData?.message || "Terjadi kesalahan.";
};

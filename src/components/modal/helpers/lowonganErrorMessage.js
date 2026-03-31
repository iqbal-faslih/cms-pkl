const collectMessages = (node, bucket = []) => {
  if (Array.isArray(node)) {
    node.forEach((item) => collectMessages(item, bucket));
    return bucket;
  }

  if (node && typeof node === "object") {
    Object.values(node).forEach((value) => collectMessages(value, bucket));
    return bucket;
  }

  if (typeof node === "string" && node.trim()) {
    bucket.push(node.trim());
  }

  return bucket;
};

export const flattenValidationMessages = (errorResponseData) => {
  const messages = [
    ...collectMessages(errorResponseData?.meta),
    ...collectMessages(errorResponseData?.errors),
  ];
  return [...new Set(messages)];
};

const isNamaTooLongError = (messages) => {
  const haystack = messages.join(" ").toLowerCase();

  const hasMySqlNamaTooLong =
    haystack.includes("data too long for column 'nama'") ||
    haystack.includes('data too long for column "nama"');

  const hasGenericNamaMaxLength =
    (haystack.includes("nama") && haystack.includes("too long")) ||
    (haystack.includes("nama") && haystack.includes("max")) ||
    (haystack.includes("nama") && haystack.includes("maximum"));

  return hasMySqlNamaTooLong || hasGenericNamaMaxLength;
};

export const resolveLowonganError = (errorResponseData) => {
  const flattened = flattenValidationMessages(errorResponseData);
  const responseMessage = errorResponseData?.message;
  const allMessages = [
    ...(responseMessage ? [String(responseMessage)] : []),
    ...flattened,
  ];

  if (isNamaTooLongError(allMessages)) {
    return {
      message: "Nama lowongan terlalu panjang",
      field: "nama",
    };
  }

  const firstMessage =
    allMessages.find((msg) => typeof msg === "string" && msg.trim()) ||
    "Terjadi kesalahan saat menyimpan data";

  return {
    message: firstMessage,
    field: null,
  };
};

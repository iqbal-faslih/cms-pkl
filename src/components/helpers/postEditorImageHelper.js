export const createImagePickerCallback = (uploadFn) => (callback) => {
  const input = document.createElement("input");
  input.setAttribute("type", "file");
  input.setAttribute("accept", "image/*");

  input.onchange = async () => {
    const file = input.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await uploadFn(formData);
      callback(response?.data?.url, { title: file.name });
    } catch (error) {
      console.error("Unggah gambar gagal:", error);
    }
  };

  input.click();
};

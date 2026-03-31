import { useState } from "react";

export const useFormValidation = () => {
  const [errors, setErrors] = useState({});

  const validateInput = (name, value) => {
    let error = "";

    switch (name) {
      case "nama_penanggung_jawab":
        if (!/^[A-Za-z\s]+$/.test(value)) {
          error = "Nama hanya boleh berisi huruf dan spasi";
        }
        break;

      case "nomor_penanggung_jawab":
        if (!/^\d+$/.test(value)) {
          error = "Nomor HP hanya boleh berisi angka";
        } else if (value.length < 10 || value.length > 13) {
          error = "Nomor HP harus 10-13 digit";
        }
        break;

      case "email_penanggung_jawab":
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = "Format email tidak valid";
        }
        break;

      case "nama":
        if (value.length < 3) {
          error = "Nama perusahaan minimal 3 karakter";
        }
        break;

      case "telepon":
        if (!/^\d+$/.test(value)) {
          error = "Nomor telepon hanya boleh berisi angka";
        } else if (value.length < 8 || value.length > 15) {
          error = "Nomor telepon harus 8-15 digit";
        }
        break;

      case "kode_pos":
        if (!/^\d{5}$/.test(value)) {
          error = "Kode pos harus 5 digit angka";
        }
        break;

      case "website":
        if (value && !value.match(/^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/)) {
          error = "Format website tidak valid (contoh: https://example.com)";
        }
        break;

      case "alamat":
        if (value.length < 10) {
          error = "Alamat minimal 10 karakter";
        }
        break;

      default:
        break;
    }

    return error;
  };

  const validateForm = (formData) => {
    const newErrors = {};
    const requiredFields = [
      "nama_penanggung_jawab",
      "nomor_penanggung_jawab",
      "email_penanggung_jawab",
      "jabatan_penanggung_jawab",
      "nama",
      "tanggal_berdiri",
      "telepon",
      "provinsi",
      "kota",
      "kecamatan",
      "alamat",
      "kode_pos",
      "website"
    ];

    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = "Field ini wajib diisi";
      } else {
        const error = validateInput(field, formData[field]);
        if (error) {
          newErrors[field] = error;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateFile = (name, file) => {
    let error = "";

    if (name === "logo") {
      if (!file.type.includes("image/")) {
        error = "Logo harus berupa file gambar (JPG, JPEG, PNG)";
      } else if (file.size > 2 * 1024 * 1024) {
        error = "Ukuran logo maksimal 2MB";
      }
    } else {
      const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
      if (!allowedTypes.includes(file.type)) {
        error = "File harus berformat JPG, JPEG, PNG, PDF, atau DOC/DOCX";
      } else if (file.size > 5 * 1024 * 1024) {
        error = "Ukuran file maksimal 5MB";
      }
    }

    return error;
  };

  return {
    errors,
    setErrors,
    validateInput,
    validateForm,
    validateFile,
  };
};

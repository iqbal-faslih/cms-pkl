import { useState, useEffect, useRef } from "react";
import { createDivisi, updateDivisi } from "../helpers/apiClient";

export default function useDivisionFrom(editingDivision, onSuccess) {
  const [data, setData] = useState({ name: "", categories: [] });
  const [categortyInput, SetCategoryInput] = useState("");
  const [fileFormUpload, setFileFormUpload] = useState(null);
  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setloading] = useState(false);
  const fileref = useRef();

  // Function Reset
  const reset = () => {
    setData({ name: "", categories: [] });
    SetCategoryInput("");
    setFileFormUpload(null);
    setPreview(null);
    setErrors({});
    if (fileref.current) fileref.current.value = "";
  };

  useEffect(() => {
    if (editingDivision) {
      setData({
        name: editingDivision.name || "",
        categories:
          editingDivision.kategori?.map((k) => ({ id: k.id, name: k.nama })) ||
          [],
      });
      editingDivision.foto_cover && setPreview(editingDivision.foto_cover);
    } else {
      setData({ name: "", categories: [] });
      setFileFormUpload(null);
      setPreview(null);
    }
    setErrors({});
    SetCategoryInput("");
  }, [editingDivision]);

  // Add Category
  const addCategory = () => {
    const t = categortyInput.trim();
    if (!t) return;
    if (!data.categories.some((c) => c.name === t))
      setData((prev) => ({
        categories: [...prev.categories, { id: Date.now(), name: t }],
      }));
    SetCategoryInput("");
  };

  //   Remove Category
  const removeCategory = (item) =>
    setData((prev) => ({
      ...prev,
      categories: prev.categories.filter((c) => c.id !== item.id),
    }));

  // Handle File
  const handleFile = (file) => {
    if (!file) return;

    setErrors((prev) => ({ ...prev, file: null }));
    if (file.size > 2 * 1024 * 1024)
      return setErrors((prev) => ({ ...prev, file: "Max 2mb" }));
    setFileFormUpload(file);
    setPreview(URL.createObjectURL(file));
  };

  // Validate
  const validate = () => {
    const e = {};
    if (!data.name.trim()) e.name = "Nama Divisi wajib Diisi";
    if (!data.categories.length) e.categories = "Minimal 1 Kategori Wajib";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async () => {
    if (!validate()) return;
    if (!editingDivision && !fileFormUpload) {
      setErrors({ file: "Wajib isi Foto" });
      return;
    }
    setloading(true);
    const form = new FormData();
    form.append("nama", data.name);
    data.categories.forEach((c, i) => {
      const categoryName =
        typeof c === "string" ? c : c?.name ?? c?.nama ?? "";
      if (categoryName) {
        form.append(`kategori_proyek[${i}][nama]`, categoryName);
        form.append(`kategori_proyek[${i}][urutan]`, i + 1);
      }
    });

    if (fileFormUpload) {
      form.append("foto_cover", fileFormUpload);
    }
    const cabangId =
      localStorage.getItem("id_cabang") ||
      editingDivision?.id_cabang ||
      editingDivision?.cabang?.id;
    if (cabangId) form.append("id_cabang", cabangId);
    if (editingDivision) form.append("_method", "PUT");

    try {
      const res = editingDivision
        ? await updateDivisi(editingDivision.id, form)
        : await createDivisi(form);
      onSuccess(res.data.data);
      reset();
    } finally {
      setloading(false);
    }
  };
  return {
    data,
    setData,
    categortyInput,
    SetCategoryInput,
    addCategory,
    removeCategory,
    preview,
    handleFile,
    fileref,
    errors,
    submit,
    loading,
    reset,
  };
}

import { useEffect, useState } from "react";
import { X, Trash2, GripVertical } from "lucide-react";

const KategoriProjectModal = ({
  open,
  onClose,
  categoryDraft,
  onCategoryDraftChange,
  onAddCategory,
  onDeleteCategory,
  onReorderCategory,
  categoryOptions = [],
  categoryActionError = "",
  categoryActionSuccess = "",
  creatingCategory = false,
  deletingCategoryId = null,
  disabled = false,
}) => {
  const [draggedCategoryId, setDraggedCategoryId] = useState(null);
  const [dragOverCategoryId, setDragOverCategoryId] = useState(null);

  useEffect(() => {
    if (!open) return undefined;

    const previousOverflow = document.body.style.overflow;
    const previousTouchAction = document.body.style.touchAction;

    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.touchAction = previousTouchAction;
    };
  }, [open]);

  const resetDragState = () => {
    setDraggedCategoryId(null);
    setDragOverCategoryId(null);
  };

  const handleDrop = (targetCategoryId) => {
    if (!draggedCategoryId || !targetCategoryId) {
      resetDragState();
      return;
    }

    if (String(draggedCategoryId) === String(targetCategoryId)) {
      resetDragState();
      return;
    }

    onReorderCategory?.(draggedCategoryId, targetCategoryId);
    resetDragState();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-200 p-5">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Kelola Kategori Project
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Tambahkan kategori yang relevan dengan kebutuhan divisi. Gunakan
              nama yang jelas, unik, dan konsisten agar mudah dipilih saat
              menyusun urutan project.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 transition hover:text-slate-600"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4 p-5">
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              type="text"
              value={categoryDraft}
              onChange={(e) => onCategoryDraftChange(e.target.value)}
              placeholder="Contoh: Tahap Pengenalan"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={onAddCategory}
              disabled={disabled || creatingCategory}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-60"
            >
              {creatingCategory ? "Menambahkan..." : "Tambah Kategori"}
            </button>
          </div>

          {categoryActionError && (
            <p className="text-xs text-red-500">{categoryActionError}</p>
          )}
          {categoryActionSuccess && (
            <p className="text-xs text-emerald-600">{categoryActionSuccess}</p>
          )}

          <div className="max-h-72 overflow-auto rounded-lg border border-slate-200">
            {categoryOptions.length === 0 ? (
              <p className="px-3 py-2 text-xs text-slate-500">Belum ada kategori</p>
            ) : (
              categoryOptions.map((category, index) => (
                <div
                  key={category.id}
                  className={`flex items-center justify-between border-b border-slate-100 px-3 py-2 last:border-b-0 ${
                    index % 2 === 0 ? "bg-white" : "bg-slate-50/80"
                  } ${
                    dragOverCategoryId === category.id
                      ? "bg-blue-50 ring-1 ring-inset ring-blue-200"
                      : ""
                  }`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    if (!disabled) {
                      setDragOverCategoryId(category.id);
                    }
                  }}
                  onDragLeave={() => {
                    if (dragOverCategoryId === category.id) {
                      setDragOverCategoryId(null);
                    }
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (!disabled) {
                      handleDrop(category.id);
                    }
                  }}
                >
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      draggable={!disabled}
                      onDragStart={(e) => {
                        if (disabled) return;
                        setDraggedCategoryId(category.id);
                        e.dataTransfer.effectAllowed = "move";
                        e.dataTransfer.setData("text/plain", String(category.id));
                      }}
                      onDragEnd={resetDragState}
                      disabled={
                        disabled ||
                        creatingCategory ||
                        deletingCategoryId === category.id
                      }
                      className="inline-flex h-7 w-7 cursor-grab items-center justify-center rounded border border-slate-200 text-slate-500 transition hover:bg-slate-100 active:cursor-grabbing disabled:opacity-40"
                      title="Tahan lalu geser untuk ubah urutan"
                    >
                      <GripVertical className="h-4 w-4" />
                    </button>
                    <span className="text-sm text-slate-700">
                      {index + 1}. {category.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => onDeleteCategory(category)}
                      disabled={
                        disabled ||
                        creatingCategory ||
                        deletingCategoryId === category.id
                      }
                      className="inline-flex items-center gap-1 rounded border border-red-200 px-2 py-1 text-xs font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-60"
                    >
                      <Trash2 className="h-4 w-4" />
                      {deletingCategoryId === category.id ? "Menghapus..." : "Hapus"}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="flex justify-end border-t border-slate-200 p-5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-600 transition hover:bg-slate-100"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

export default KategoriProjectModal;

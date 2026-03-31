import MultiSelect from "../../../shared/components/input/MultiselectField.jsx";
import UploadFile from "../../../shared/components/ui/UploadFile.jsx";
import KategoriProjectModal from "../../../components/modal/perusahaan/KategoriProjectModal.jsx";

const DivisiAddPage = ({
  formMode,
  formState,
  setFormState,
  formErrors,
  upload,
  categoryOptions,
  categoryDraft,
  onCategoryDraftChange,
  onAddCategory,
  onDeleteCategory,
  onRemoveSelectedCategory,
  onReorderCategory,
  isCategoryModalOpen,
  onOpenCategoryModal,
  onCloseCategoryModal,
  categoryActionError = "",
  categoryActionSuccess = "",
  creatingCategory = false,
  deletingCategoryId = null,
  submitting = false,
  onCancel,
  onSave,
}) => {
  return (
    <div className="rounded-xl bg-[#f8f8fb] p-5 sm:p-7">
      <h2 className="text-2xl font-bold text-slate-900">
        {formMode === "edit" ? "Edit Divisi" : "Tambah Divisi Baru"}
      </h2>
      <p className="text-sm text-slate-500 mt-1 mb-6">
        {formMode === "edit"
          ? "Perbarui data divisi"
          : "Tambahkan data divisi baru"}
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold text-slate-800">
            Nama Divisi
          </label>
          <input
            type="text"
            value={formState.name}
            onChange={(e) =>
              setFormState((prev) => ({ ...prev, name: e.target.value }))
            }
            className={`mt-2 w-full rounded-lg border bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              formErrors.name ? "border-red-500" : "border-slate-300"
            }`}
            placeholder="Masukan Nama Divisi"
          />
          {formErrors.name && (
            <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
          )}
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-800">Catatan</label>
          <input
            type="text"
            value={formState.note}
            onChange={(e) =>
              setFormState((prev) => ({ ...prev, note: e.target.value }))
            }
            className={`mt-2 w-full rounded-lg border bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              formErrors.note ? "border-red-500" : "border-slate-300"
            }`}
            placeholder="Masukan Catatan"
          />
          {formErrors.note && (
            <p className="text-red-500 text-xs mt-1">{formErrors.note}</p>
          )}
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-800">
            Ketentuan Divisi
          </label>
          <textarea
            value={formState.rules}
            onChange={(e) =>
              setFormState((prev) => ({ ...prev, rules: e.target.value }))
            }
            rows={4}
            className={`mt-2 w-full rounded-lg border bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              formErrors.rules ? "border-red-500" : "border-slate-300"
            }`}
            placeholder="Masukan Ketentuan Divisi"
          />
          {formErrors.rules && (
            <p className="text-red-500 text-xs mt-1">{formErrors.rules}</p>
          )}
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-800">
            Foto Cover
          </label>
          <UploadFile
            fileState={upload.fileState}
            onSelectFile={upload.selectFile}
            onRetry={upload.retry}
            onDelete={upload.deleteFile}
          />
          {formMode === "edit" && !upload.fileState?.file && formState.cover && (
            <button
              type="button"
              onClick={() => window.open(formState.cover, "_blank", "noopener,noreferrer")}
              className="text-purple-600 font-semibold mt-2 hover:text-purple-700"
            >
              Click to view
            </button>
          )}
          {formErrors.file && (
            <p className="text-red-500 text-xs mt-1">{formErrors.file}</p>
          )}
        </div>
      </div>

      <div className="mt-5">
        <MultiSelect
          label="Kategori Project"
          previewLabel="Preview Urutan Kategori Project"
          placeholder="Pilih Kategori"
          selectedItems={formState.categories}
          onSelectionChange={(selectedItems) =>
            setFormState((prev) => ({ ...prev, categories: selectedItems }))
          }
          onRemoveSelectedItem={onRemoveSelectedCategory}
          options={categoryOptions}
          error={formErrors.categories}
          dropdownActionLabel="+ Tambah Kategori"
          onDropdownActionClick={onOpenCategoryModal}
          enableSelectAll
          selectAllLabel="Pilih Semua Kategori"
        />
        {formErrors.branch && (
          <p className="text-red-500 text-xs mt-1">{formErrors.branch}</p>
        )}
      </div>

      <div className="mt-10 flex items-center justify-end gap-2">
        <button
          type="button"
          className="px-6 py-2 rounded-lg border border-slate-300 text-slate-600 text-sm hover:bg-slate-100"
          disabled={submitting}
          onClick={onCancel}
        >
          Batal
        </button>
        <button
          type="button"
          className="px-6 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700"
          disabled={submitting}
          onClick={onSave}
        >
          {submitting ? "Menyimpan..." : "Simpan"}
        </button>
      </div>

      <KategoriProjectModal
        open={isCategoryModalOpen}
        onClose={onCloseCategoryModal}
        categoryDraft={categoryDraft}
        onCategoryDraftChange={onCategoryDraftChange}
        onAddCategory={onAddCategory}
        onDeleteCategory={onDeleteCategory}
        onReorderCategory={onReorderCategory}
        categoryOptions={categoryOptions}
        categoryActionError={categoryActionError}
        categoryActionSuccess={categoryActionSuccess}
        creatingCategory={creatingCategory}
        deletingCategoryId={deletingCategoryId}
        disabled={submitting}
      />
    </div>
  );
};

export default DivisiAddPage;

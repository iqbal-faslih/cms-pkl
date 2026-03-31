import React from "react";
import Notifikasi from "../../../shared/components/modal/NotifikasiModal.jsx";
import FormModal from "../../../shared/components/modal/FormModal.jsx";
import Card from "../../../components/cards/Card.jsx";
import DivisiAddPage from "./DivisiAddPage.jsx";
import { useDivisiManagement } from "./hooks/useDivisiManagement";
import DivisiToolbar from "./components/DivisiToolbar.jsx";
import DivisionGridState from "./components/DivisionGridState.jsx";
import { getDivisionDetailFields } from "./helpers/getDivisionDetailFields.jsx";

const DivisiPage = () => {
  const {
    loading,
    submitting,
    setSortOption,
    isFormPageOpen,
    formMode,
    formState,
    setFormState,
    formErrors,
    upload,
    detailOpen,
    setDetailOpen,
    detailData,
    isDeleteOpen,
    setIsDeleteOpen,
    selectedDivision,
    openActionId,
    setOpenActionId,
    categoryOptions,
    categoryDraft,
    onCategoryDraftChange,
    onAddCategory,
    onDeleteCategory,
    onRemoveSelectedCategory,
    onReorderCategory,
    isCategoryModalOpen,
    setIsCategoryModalOpen,
    categoryActionError,
    categoryActionSuccess,
    creatingCategory,
    deletingCategoryId,
    onOpenAddPage,
    onOpenEditPage,
    onCancelForm,
    onSaveForm,
    sortedDivisions,
    onDetail,
    onDeleteClick,
    onConfirmDelete,
  } = useDivisiManagement();

  return (
    <>
      <div className="bg-blue-600 text-white p-6 rounded-lg mb-4 flex justify-between items-center">
        <div>
          <p className="text-lg font-semibold">Selamat Pagi Mr. Gojo!</p>
          <p>Anda Berada di halaman cabang Malang</p>
        </div>
        <img
          src="/assets/img/banner-icon.png"
          alt="Banner Icon"
          className="w-40 h-24 object-contain"
        />
      </div>

      <Card className="rounded-2xl">
        {isFormPageOpen ? (
          <DivisiAddPage
            formMode={formMode}
            formState={formState}
            setFormState={setFormState}
            formErrors={formErrors}
            upload={upload}
            categoryOptions={categoryOptions}
            categoryDraft={categoryDraft}
            onCategoryDraftChange={onCategoryDraftChange}
            onAddCategory={onAddCategory}
            onDeleteCategory={onDeleteCategory}
            onRemoveSelectedCategory={onRemoveSelectedCategory}
            onReorderCategory={onReorderCategory}
            isCategoryModalOpen={isCategoryModalOpen}
            onOpenCategoryModal={() => {
              setIsCategoryModalOpen(true);
            }}
            onCloseCategoryModal={() => setIsCategoryModalOpen(false)}
            categoryActionError={categoryActionError}
            categoryActionSuccess={categoryActionSuccess}
            creatingCategory={creatingCategory}
            deletingCategoryId={deletingCategoryId}
            submitting={submitting}
            onCancel={onCancelForm}
            onSave={onSaveForm}
          />
        ) : (
          <>
            <DivisiToolbar
              setSortOption={setSortOption}
              setOpenActionId={setOpenActionId}
              onOpenAddPage={onOpenAddPage}
            />

            <DivisionGridState
              loading={loading}
              sortedDivisions={sortedDivisions}
              openActionId={openActionId}
              setOpenActionId={setOpenActionId}
              onDeleteClick={onDeleteClick}
              onDetail={onDetail}
              onOpenEditPage={onOpenEditPage}
            />
          </>
        )}

        <FormModal
          open={detailOpen}
          onClose={() => setDetailOpen(false)}
          title="Detail Divisi"
          showIcon={false}
          fields={getDivisionDetailFields(detailData)}
          actions={[
            {
              label: "Cancel",
              className:
                "px-6 py-2 rounded-md border border-gray-200 font-semibold text-gray-700 hover:bg-gray-100 w-full",
              onClick: () => setDetailOpen(false),
            },
          ]}
        />

        <Notifikasi
          isOpen={isDeleteOpen}
          onClose={() => setIsDeleteOpen(false)}
          onConfirm={onConfirmDelete}
          title="Hapus Divisi?"
          message={`Apakah Anda yakin ingin menghapus divisi "${
            selectedDivision?.title || ""
          }"?`}
          confirmText="Hapus"
          cancelText="Batal"
          iconColor="text-red-500"
          confirmColor="bg-red-600 hover:bg-red-700"
          icon={() => <span>!</span>}
        />
      </Card>
    </>
  );
};

export default DivisiPage;

import React from "react";
import { approvalConfig } from "../../../../shared/config/approvalConfig";
import DataTable from "../../../../shared/components/table/Table";
import TableHeader from "../../../../shared/components/table/TableHeader";
import Search from "../../../../shared/components/Search";
import Button from "../../../../shared/components/button/Button";
import FilterDrop from "../../../../shared/components/button/FilterDrop";
import { SortButton } from "../../../../shared/components/button";
import ModalDetailPendaftar from "../../../../components/modal/ModalDetailPendaftar";
import ModalDetailIzin from "../../../../components/modal/ModalDetailIzin";
import DatePicker from "react-datepicker";
import { getPendaftaranColumns } from "../../../../shared/components/table/columns/PendaftaranColumns";
import { getIzinColumns } from "../../../../shared/components/table/columns/IzinColumns";
import { exportIndividualExcel } from "../../../../shared/helpers/exportHelpers";
import { useApprovalTableController } from "../hooks/useApprovalTableController";
import { showConfirmAlert } from "../../../../helpers/sweetAlertHelper";
import { toast } from "react-toastify";

const TableApproval = ({
  data = [],
  activeTab,
  setActiveTab,
  pagination,
  filterState,
  isLoading,
  onUpdatePendaftaranStatuses,
  onUpdateIzinStatuses,
  searchQuery,
  setSearchQuery,
  isActionLoading = false,
}) => {
  const {
    isModalOpen,
    selectedData,
    showCheckboxes,
    isActionMenuOpen,
    selectedCount,
    tempSelectedStatuses,
    tempSelectedAlasanIzin,
    tempDate,
    setTempDate,
    selectedItems,
    selectedIzinItems,
    handleSelectItem,
    handleToggleIzinCheckbox,
    isRowSelectable,
    handleOpenModal,
    handleCloseModal,
    handleApplyFilter,
    handleStatusChange,
    handleAlasanIzinChange,
    handleResetFilter,
    handleBatchModeToggle,
    handleBatchModeCancel,
    handleActionMenuToggle,
    handleActionMenuClose,
    executeBulkAction,
    filterStatusOptions,
    sortOptions,
  } = useApprovalTableController({
    activeTab,
    currentPage: pagination.currentPage,
    filterState,
    onUpdatePendaftaranStatuses,
    onUpdateIzinStatuses,
  });

  const requestBulkAction = (status) => {
    if (selectedCount === 0 || isActionLoading) return;
    handleActionMenuClose();
    const actionLabel = status === "Diterima" ? "Terima" : "Tolak";
    const verbLabel = status === "Diterima" ? "menerima" : "menolak";
    showConfirmAlert(
      `Konfirmasi ${actionLabel} peserta?`,
      `Anda yakin ingin ${verbLabel} ${selectedCount} peserta terpilih?`,
      "Ya, lanjutkan"
    ).then(async (confirm) => {
      if (!confirm?.isConfirmed) return;
      const actionCount = selectedCount;
      const success = await executeBulkAction(status);
      if (!success) return;

      toast.success(
        `${actionCount} peserta berhasil ${status === "Diterima" ? "diterima" : "ditolak"}`
      );
    });
  };

  const config = approvalConfig;
  const tableConfig = config.tableConfig;

  const currentColumns =
    activeTab === "pendaftaran"
      ? getPendaftaranColumns(
          tableConfig,
          showCheckboxes,
          selectedItems,
          handleSelectItem,
          handleOpenModal,
          isRowSelectable
        )
      : getIzinColumns(
          tableConfig,
          showCheckboxes,
          selectedIzinItems,
          handleToggleIzinCheckbox,
          (row) => exportIndividualExcel(row, activeTab),
          isRowSelectable
        );

  const currentTableConfig =
    activeTab === "pendaftaran"
      ? { ...tableConfig.pendaftaran, columns: currentColumns }
      : { ...tableConfig.izin, columns: currentColumns };

  const titleLeftActions = [
    <Button
      key="tab-pendaftaran"
      onClick={() => setActiveTab("pendaftaran")}
      className={`px-4 py-2 rounded-lg text-sm font-medium ${
        activeTab === "pendaftaran"
          ? "bg-blue-600 text-white"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      }`}
    >
      Pendaftaran
    </Button>,
    <Button
      key="tab-izin"
      onClick={() => setActiveTab("izin")}
      className={`px-4 py-2 rounded-lg text-sm font-medium ${
        activeTab === "izin"
          ? "bg-blue-600 text-white"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      }`}
    >
      Izin/Sakit
    </Button>,
  ];

  const headerConfig = {
    ...config.headerConfig,
    titleLeftActions: titleLeftActions,
    titleRightActions: [],
    top: {
      ...config.headerConfig.top,
      right: [
        <SortButton
          key="sort"
          options={sortOptions}
          onSelect={(val) => filterState.setSort(val)}
        />,

        <Button
          key="actions"
          onClick={handleBatchModeToggle}
          className={`px-5 py-2 text-sm rounded-lg text-white ${
            showCheckboxes ? "bg-gray-500 hover:bg-gray-600" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {showCheckboxes ? "Batal Pilih" : "Pilih Peserta"}
        </Button>,

        <FilterDrop
          key="filter-status"
          label="Filter"
          showDateFilter={true}
          content={{
            render: (filterComponents) => {
              const CustomDateInput = filterComponents.CustomDateInput;
              const DefaultCheckbox = filterComponents.DefaultCheckbox;

              return (
                <div>
                  {activeTab === "pendaftaran" && (
                    <div className="mb-3">
                      <p className="text-lg font-medium mb-2">Masa Magang</p>
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <p className="text-sm font-medium mb-1">Dari</p>
                          <DatePicker
                            selected={tempDate.start}
                            onChange={(date) =>
                              setTempDate((prev) => ({ ...prev, start: date }))
                            }
                            dateFormat="dd/MM/yyyy"
                            customInput={<CustomDateInput />}
                          />
                        </div>

                        <div className="flex-1">
                          <p className="text-sm font-medium mb-1">Ke</p>
                          <DatePicker
                            selected={tempDate.end}
                            onChange={(date) =>
                              setTempDate((prev) => ({ ...prev, end: date }))
                            }
                            dateFormat="dd/MM/yyyy"
                            customInput={<CustomDateInput />}
                          />
                        </div>
                      </div>
                      <hr className="border-gray-200 my-3" />
                    </div>
                  )}

                  <p className="text-lg font-medium mb-2">Status</p>
                  <div className="space-y-2 mb-4">
                    {filterStatusOptions.map((status) => (
                      <DefaultCheckbox
                        key={status}
                        label={status}
                        checked={tempSelectedStatuses.includes(status)}
                        onChange={() => handleStatusChange(status)}
                        boxClass="border border-blue-500 rounded data-[checked=true]:bg-blue-500"
                      />
                    ))}
                  </div>
                  {activeTab === "izin" && (
                    <>
                      <p className="text-lg font-medium mb-2">Alasan Izin</p>
                      <div className="space-y-2">
                        <DefaultCheckbox
                          key="izin"
                          label="Izin"
                          checked={tempSelectedAlasanIzin.includes("izin")}
                          onChange={() => handleAlasanIzinChange("izin")}
                          boxClass="border border-blue-500 rounded data-[checked=true]:bg-blue-500"
                        />
                        <DefaultCheckbox
                          key="sakit"
                          label="Sakit"
                          checked={tempSelectedAlasanIzin.includes("sakit")}
                          onChange={() => handleAlasanIzinChange("sakit")}
                          boxClass="border border-blue-500 rounded data-[checked=true]:bg-blue-500"
                        />
                      </div>
                    </>
                  )}
                </div>
              );
            },
            onApply: (filters) => handleApplyFilter(filters),
            onReset: handleResetFilter,
          }}
        />,
      ],
      left: [
        <Search
          key="search"
          id="approval-search"
          name="approval-search"
          value={searchQuery}
          onChange={setSearchQuery}
        />,
      ],
    },
  };

  

  return (
    <div className="w-full space-y-6">
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div>
          <TableHeader config={headerConfig} />
        </div>

        {showCheckboxes && (
          <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 flex items-center justify-between">
            <div className="text-sm text-blue-800">
              {selectedCount} peserta dipilih
            </div>
            <div className="flex items-center gap-2 relative">
              <Button
                onClick={handleActionMenuToggle}
                disabled={selectedCount === 0 || isActionLoading}
                className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Aksi
              </Button>
              {isActionMenuOpen && (
                <div className="absolute top-full right-0 mt-2 min-w-[140px] bg-white border border-gray-200 rounded-lg shadow-md z-20 p-1">
                  <button
                    onClick={() => requestBulkAction("Diterima")}
                    className="w-full text-left px-3 py-2 text-sm rounded hover:bg-green-50 text-green-700"
                  >
                    Terima
                  </button>
                  <button
                    onClick={() => requestBulkAction("Ditolak")}
                    className="w-full text-left px-3 py-2 text-sm rounded hover:bg-red-50 text-red-700"
                  >
                    Tolak
                  </button>
                </div>
              )}
              <Button
                onClick={handleBatchModeCancel}
                className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 rounded"
              >
                Selesai
              </Button>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-gray-500">Memuat data approval...</div>
            </div>
          ) : data?.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-gray-500">
                {searchQuery
                  ? `Tidak ada hasil untuk "${searchQuery}"`
                  : "Tidak ada data approval"}
              </div>
            </div>
          ) : (
            <DataTable
              config={{
                columns: currentTableConfig.columns,
                headerStyle: tableConfig.headerStyle,
                cellStyle: tableConfig.cellStyle,
                className: tableConfig.className,
              }}
              data={data}
              pagination={{
                currentPage: pagination.currentPage,
                totalPages: pagination.totalPages,
                itemsPerPage: pagination.itemsPerPage,
                totalItems: pagination.totalItems,
                onPageChange: pagination.onPageChange,
                label: "data",
              }}
            />
          )}
        </div>
      </div>

      {activeTab === "pendaftaran" && (
        <ModalDetailPendaftar
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          data={selectedData}
        />
      )}

      {activeTab === "izin" && (
        <ModalDetailIzin
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          data={
            selectedData
              ? {
                  tanggal: selectedData.tanggal,
                  suratUrl: selectedData.surat_url || "",
                  deskripsi: selectedData.alasan || "-",
                }
              : null
          }
        />
      )}

    </div>
  );
};

export default TableApproval;

import React, { useState, useEffect, useRef } from "react";
import { approvalConfig } from "../../../../shared/config/approvalConfig";
import DataTable from "../../../../shared/components/table/Table";
import TableHeader from "../../../../shared/components/table/TableHeader";
import Search from "../../../../shared/components/Search";
import Button from "../../../../shared/components/button/Button";
import FilterDrop from "../../../../shared/components/button/FilterDrop";
import { SortButton } from "../../../../shared/components/button";
import ModalDetailPendaftar from "../../../../components/modal/ModalDetailPendaftar";
import ModalDetailIzin from "../../../../components/modal/ModalDetailIzin";
import { FiChevronDown } from "react-icons/fi";
import Checkbox from "../../../../shared/components/Checkbox";
import DatePicker from "react-datepicker";
import { getPendaftaranColumns } from "../../../../shared/components/table/columns/PendaftaranColumns";
import { getIzinColumns } from "../../../../shared/components/table/columns/IzinColumns";
import { useTableSelection } from "../../../../shared/hooks/useTableSelection";
import { exportIndividualExcel } from "../../../../shared/helpers/exportHelpers";

const TableApprovalCabang = ({
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
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [showCheckboxes, setShowCheckboxes] = useState(false);
  const [isActionsDropdownOpen, setIsActionsDropdownOpen] = useState(false);
  const [actionsSelectedStatus, setActionsSelectedStatus] = useState("");
  const wrapperRef = useRef(null);

  const [tempSelectedStatuses, setTempSelectedStatuses] = useState([]);
  const [tempSelectedAlasanIzin, setTempSelectedAlasanIzin] = useState([]);
  const [tempDate, setTempDate] = useState({ start: null, end: null });

  const {
    selectedItems,
    setSelectedItems,
    selectedIzinItems,
    setSelectedIzinItems,
    handleSelectItem,
    handleToggleIzinCheckbox,
  } = useTableSelection();

  useEffect(() => {
    setSelectedItems([]);
    setSelectedIzinItems([]);
    setTempSelectedStatuses([]);
    setTempSelectedAlasanIzin([]);
    setTempDate({ start: null, end: null });
  }, [activeTab, pagination.currentPage]);

  const filterStatusOptions = ["Ditolak", "Diterima", "Pending"];
  const actionsStatusOptions = ["Ditolak", "Diterima"];

  const handleOpenModal = (row) => {
    setSelectedData({ id: row.id });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedData(null);
  };

const handleApplyFilter = (filters) => {
  filterState.onFilterChange({
    status: tempSelectedStatuses,
    alasan: tempSelectedAlasanIzin,
    masaMagang: {
      from: tempDate.start,
      to: tempDate.end,
    },
    date: {
      from: filters.dateFrom,
      to: filters.dateTo,
    },
  });
};


  const handleStatusChange = (status) => {
    setTempSelectedStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const handleAlasanIzinChange = (alasan) => {
    setTempSelectedAlasanIzin((prev) =>
      prev.includes(alasan)
        ? prev.filter((a) => a !== alasan)
        : [...prev, alasan]
    );
  };

  const handleResetFilter = () => {
    setTempSelectedStatuses([]);
    setTempSelectedAlasanIzin([]);
    setTempDate({ start: null, end: null });

    filterState.reset();
  };

  const handleActionsDropdownToggle = () => {
    setIsActionsDropdownOpen(!isActionsDropdownOpen);
    setShowCheckboxes(!isActionsDropdownOpen);
  };

  const handleActionsDropdownClose = () => {
    setIsActionsDropdownOpen(false);
    setActionsSelectedStatus("");
    setShowCheckboxes(false);
    setSelectedItems([]);
    setSelectedIzinItems([]);
  };

  const handleActionsReset = () => {
    if (activeTab === "pendaftaran") {
      if (selectedItems.length > 0) {
        onUpdatePendaftaranStatuses(selectedItems, "Pending");
      }
    } else {
      if (selectedIzinItems.length > 0) {
        onUpdateIzinStatuses(selectedIzinItems, "Pending");
      }
    }

    setActionsSelectedStatus("");
    setShowCheckboxes(false);
    setIsActionsDropdownOpen(false);
    setSelectedItems([]);
    setSelectedIzinItems([]);
  };

  const handleActionsApply = () => {
    if (actionsSelectedStatus) {
      if (activeTab === "pendaftaran") {
        if (selectedItems.length > 0) {
          onUpdatePendaftaranStatuses(selectedItems, actionsSelectedStatus);
        }
      } else {
        if (selectedIzinItems.length > 0) {
          onUpdateIzinStatuses(selectedIzinItems, actionsSelectedStatus);
        }
      }
      handleActionsDropdownClose();
    }
  };

  const config = approvalConfig;
  const tableConfig = config.tableConfig;

    useEffect(() => {
    const handleClickOutside = (e) => {
    if (wrapperRef.current && !wrapperRef.current.contains(e.target)&& !e.target.closest(".select-field-dropdown")) {
    setIsActionsDropdownOpen(false);
    }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

  const handleSelectAllPendaftaran = () => {
    if (selectedItems.length === data.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(data.map((item) => item.id));
    }
  };

  const handleSelectAllIzin = () => {
    if (selectedIzinItems.length === data.length) {
      setSelectedIzinItems([]);
    } else {
      setSelectedIzinItems(data.map((item) => item.id));
    }
  };

  const currentColumns =
    activeTab === "pendaftaran"
      ? getPendaftaranColumns(
          tableConfig,
          showCheckboxes,
          selectedItems,
          handleSelectItem,
          handleOpenModal,
          handleSelectAllPendaftaran,
          data.length
        )
      : getIzinColumns(
          tableConfig,
          showCheckboxes,
          selectedIzinItems,
          handleToggleIzinCheckbox,
          (row) => exportIndividualExcel(row, activeTab),
          handleSelectAllIzin,
          data.length
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
        <SortButton key="sort" onSelect={(val) => filterState.setSort(val)} />,

        <div key="actions" ref={wrapperRef} className="relative mr-2">
          <Button
            onClick={handleActionsDropdownToggle}
            className="flex items-center gap-2 px-5 py-2 text-sm border-purple-300 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
          >
            Actions
            <FiChevronDown className="w-4 h-4" />
          </Button>
          {isActionsDropdownOpen && (
            <div  className="absolute top-full mt-1 right-0 bg-white border border-gray-300 rounded-lg shadow-lg z-50 p-4 w-64">
              <p className="text-lg font-medium mb-4 pb-2 border-b-1 pl-1 border-gray-300">
                Aksi
              </p>
              <div className="space-y-2 mb-4">
                {actionsStatusOptions.map((status) => (
                  <Checkbox
                    key={status}
                    label={status}
                    checked={actionsSelectedStatus === status}
                    onChange={() => setActionsSelectedStatus(status)}
                    boxClass="border border-blue-500 rounded"
                  />
                ))}
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  onClick={handleActionsReset}
                  className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 rounded"
                >
                  Reset
                </Button>
                <Button
                  onClick={handleActionsApply}
                  className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded"
                  disabled={
                    !actionsSelectedStatus ||
                    (activeTab === "pendaftaran"
                      ? selectedItems.length === 0
                      : selectedIzinItems.length === 0)
                  }
                >
                  Apply
                </Button>
              </div>
            </div>
          )}
        </div>,

        <FilterDrop
          key="filter-status"
          label="Filter"
          showDateFilter={true}
          content={{
            render: ({ close, DefaultCheckbox, CustomDateInput }) => (
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
            ),
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

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-gray-500">Loading...</div>
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

export default TableApprovalCabang;

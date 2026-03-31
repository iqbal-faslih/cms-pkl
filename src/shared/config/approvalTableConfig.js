import { getPendaftaranColumns } from "../components/table/columns/PendaftaranColumns";
import { getIzinColumns } from "../components/table/columns/IzinColumns";
import { exportIndividualExcel } from "../utils/exportUtils";
import { approvalConfig } from "./approvalConfig";

export const getApprovalTableConfig = ({
  activeTab,
  showCheckboxes,
  selectedItems,
  selectedIzinItems,
  handleSelectItem,
  handleToggleIzinCheckbox,
  handleOpenModal,
  handleSelectAllPendaftaran,
  handleSelectAllIzin,
  paginatedData,
}) => {
  // Get columns based on active tab
  const currentColumns =
    activeTab === "pendaftaran"
      ? getPendaftaranColumns(
          approvalConfig.tableConfig,
          showCheckboxes,
          selectedItems,
          handleSelectItem,
          handleOpenModal,
          handleSelectAllPendaftaran,
          paginatedData.length
        )
      : getIzinColumns(
          approvalConfig.tableConfig,
          showCheckboxes,
          selectedIzinItems,
          handleToggleIzinCheckbox,
          (row) => exportIndividualExcel(row, activeTab),
          handleSelectAllIzin,
          paginatedData.length
        );

  const currentTableConfig =
    activeTab === "pendaftaran"
      ? { columns: currentColumns }
      : { columns: currentColumns };

  return currentTableConfig;
};

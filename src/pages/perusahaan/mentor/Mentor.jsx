import React from "react";
import TableHeader from "@/shared/components/table/TableHeader";
import DataTable from "@/shared/components/table/Table";
import { MentorConfig } from "@/shared/config/Perusahaan/MentorConfig";
import { useNavigate } from "react-router-dom";
import { useMentorTableData } from "./hooks/useMentorTableData";
import { resolveMentorRoleContext } from "./helpers/mentorRoleContext";
import {
  buildMentorSkeletonRows,
  renderMentorSkeletonCell,
} from "./components/MentorTableSkeleton";

const MentorTable = () => {
  const navigate = useNavigate();
  const { isCabangRole, mentorRouteBase } = resolveMentorRoleContext();

  const {
    loading,
    searchQuery,
    setSearchQuery,
    setSortValue,
    filterState,
    divisionFilterOptions,
    filteredTotal,
    page,
    setPage,
    itemsPerPage,
    paginated,
    openMentorDetail,
    openMentorEdit,
    deleteMentor,
    openAddMentor,
  } = useMentorTableData({ isCabangRole, routeBase: mentorRouteBase, navigate });

  const modalActions = {
    setSortValue,
    openAdd: openAddMentor,
    view: openMentorDetail,
    edit: openMentorEdit,
    delete: deleteMentor,
  };

  const config = MentorConfig(
    filterState,
    divisionFilterOptions,
    searchQuery,
    setSearchQuery,
    {},
    modalActions
  );

  const loadingTableConfig = React.useMemo(() => {
    const tableConfig = config?.tableConfig || {};
    return {
      ...tableConfig,
      columns: (tableConfig.columns || []).map((column) => ({
        ...column,
        render: () => renderMentorSkeletonCell(column.key),
      })),
    };
  }, [config]);

  const tableData = loading ? buildMentorSkeletonRows() : paginated;
  const tableConfig = loading ? loadingTableConfig : config.tableConfig;
  const tablePagination = loading
    ? undefined
    : {
        currentPage: page,
        totalPages: Math.ceil(filteredTotal / itemsPerPage),
        itemsPerPage,
        totalItems: filteredTotal,
        onPageChange: setPage,
      };

  return (
    <div className="bg-white shadow-md rounded-2xl p-6">
      <TableHeader config={config.headerConfig} />

      <DataTable
        config={tableConfig}
        data={tableData}
        emptyMessage="Tidak ada data mentor"
        pagination={tablePagination}
      />
    </div>
  );
};

export default MentorTable;

import TableHeader from "../../shared/components/table/TableHeader";
import DataTable from "../../shared/components/table/Table";
import ErrorOverlay from "@/shared/components/cards/ErrorOverlay";
import { usePesertaBranchTable } from "./hooks/usePesertaBranchTable";

export default function PesertaBranchCard() {
  const {
    config,
    data,
    showSkeleton,
    itemsPerPage,
    currentPage,
    totalPages,
    totalItems,
    handlePageChange,
    errorMessage,
    closeError,
    refetch,
  } = usePesertaBranchTable();

  return (
    <>
      <div className="bg-white shadow-md rounded-2xl p-6">
        <TableHeader config={config.headers} />

        {showSkeleton ? (
          <div className="py-10 text-center text-gray-500">
            Memuat data peserta...
          </div>
        ) : (
          <DataTable
            config={{
              columns: config.columns,
              headerStyle: config.headerStyle,
              cellStyle: config.cellStyle,
            }}
            data={data}
            pagination={{
              currentPage,
              totalPages,
              itemsPerPage,
              totalItems,
              onPageChange: handlePageChange,
            }}
          />
        )}
      </div>

      {errorMessage && (
        <ErrorOverlay
          message={errorMessage}
          onRetry={() => {
            closeError();
            refetch?.();
          }}
          onClose={closeError}
        />
      )}
    </>
  );
}

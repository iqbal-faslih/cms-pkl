import React from "react";
import TableApprovalCabang from "../../shared/components/table/TableApprovalCabang";

export default function ManajemenApproval() {
  // Status update handlers for the new TableApproval component
  const handleUpdatePendaftaranStatuses = (ids, status) => {
    console.log(`📤 Updating pendaftaran statuses for IDs:`, ids, `to status:`, status);
    // TODO: Implement actual API call to update pendaftaran statuses
  };

  const handleUpdateIzinStatuses = (ids, status) => {
    console.log(`📤 Updating izin statuses for IDs:`, ids, `to status:`, status);
    // TODO: Implement actual API call to update izin statuses
  };

  return (
    <div className="w-full space-y-6">
      <TableApprovalCabang
        onUpdatePendaftaranStatuses={handleUpdatePendaftaranStatuses}
        onUpdateIzinStatuses={handleUpdateIzinStatuses}
      />
    </div>
  );
}

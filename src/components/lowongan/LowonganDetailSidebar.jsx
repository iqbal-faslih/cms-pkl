import React from "react";
import JobDetail from "../cards/JobDetail";

const LowonganDetailSidebar = ({
  selectedJob,
  selectedJobDetail,
  showModal,
  handleCloseDetail,
  handleEditJob,
  handleJobDetailSuccess,
  detailLoading,
  className = "w-1/3 min-w-0",
  sticky = true
}) => {
  if (!selectedJob || showModal) return null;

  return (
    <div className={className}>
      <div className={sticky ? "sticky top-6" : ""}>
        <JobDetail
          job={selectedJobDetail || selectedJob}
          onClose={handleCloseDetail}
          onEdit={() => handleEditJob(selectedJob)}
          onSucces={handleJobDetailSuccess}
          loading={detailLoading}
        />
      </div>
    </div>
  );
};

export default LowonganDetailSidebar;

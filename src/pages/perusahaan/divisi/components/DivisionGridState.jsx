import React from "react";
import DivisionCard from "./DivisionCard.jsx";
import DivisionCardSkeleton from "./DivisionCardSkeleton.jsx";

const GRID_CLASSNAME =
  "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6";

const DivisionGridState = ({
  loading,
  sortedDivisions,
  openActionId,
  setOpenActionId,
  onDeleteClick,
  onDetail,
  onOpenEditPage,
}) => {
  if (loading) {
    return (
      <div className={GRID_CLASSNAME}>
        {Array.from({ length: 8 }).map((_, index) => (
          <DivisionCardSkeleton key={`division-skeleton-${index}`} />
        ))}
      </div>
    );
  }

  if (sortedDivisions.length === 0) {
    return (
      <div className="py-8 text-center text-sm text-slate-500">
        Tidak ada data divisi
      </div>
    );
  }

  return (
    <div className={GRID_CLASSNAME}>
      {sortedDivisions.map((division) => (
        <DivisionCard
          key={division.id}
          division={division}
          openActionId={openActionId}
          setOpenActionId={setOpenActionId}
          onDelete={() => onDeleteClick(division)}
          onDetail={() => onDetail(division)}
          onEdit={() => {
            setOpenActionId(null);
            onOpenEditPage(division);
          }}
        />
      ))}
    </div>
  );
};

export default DivisionGridState;

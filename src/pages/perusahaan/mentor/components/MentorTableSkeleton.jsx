import React from "react";

export const buildMentorSkeletonRows = (count = 6) =>
  Array.from({ length: count }, (_, index) => ({ id: `mentor-skeleton-${index}` }));

export const renderMentorSkeletonCell = (columnKey) => {
  if (columnKey === "nama_mentor") {
    return (
      <div className="flex justify-start items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-slate-200 animate-pulse" />
        <div className="h-4 w-32 rounded bg-slate-200 animate-pulse" />
      </div>
    );
  }

  if (columnKey === "aksi") {
    return (
      <div className="flex justify-center gap-2">
        <div className="w-8 h-8 rounded-md bg-slate-200 animate-pulse" />
        <div className="w-8 h-8 rounded-md bg-slate-200 animate-pulse" />
        <div className="w-8 h-8 rounded-md bg-slate-200 animate-pulse" />
      </div>
    );
  }

  if (columnKey === "no") {
    return <div className="h-4 w-6 rounded bg-slate-200 animate-pulse mx-auto" />;
  }

  if (columnKey === "created_at") {
    return <div className="h-4 w-28 rounded bg-slate-200 animate-pulse mx-auto" />;
  }

  if (columnKey === "email") {
    return <div className="h-4 w-36 rounded bg-slate-200 animate-pulse mx-auto" />;
  }

  return <div className="h-4 w-20 rounded bg-slate-200 animate-pulse mx-auto" />;
};

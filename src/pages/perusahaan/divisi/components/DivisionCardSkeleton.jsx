import React from "react";

const DivisionCardSkeleton = () => (
  <div className="bg-white rounded-xl shadow relative p-4 animate-pulse">
    <div className="bg-slate-200 rounded-lg h-32 mb-4" />
    <div className="h-5 w-3/4 bg-slate-200 rounded mb-3" />
    <div className="flex items-center gap-2 mb-4">
      <div className="w-4 h-4 rounded bg-slate-200" />
      <div className="h-4 w-1/2 bg-slate-200 rounded" />
    </div>
    <div className="h-10 w-full bg-slate-200 rounded" />
  </div>
);

export default DivisionCardSkeleton;

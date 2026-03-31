import React from "react";

const LowonganTableSkeletonRows = ({ rows = 6 }) =>
  Array.from({ length: rows }).map((_, index) => (
    <tr key={`lowongan-skeleton-row-${index}`} className="animate-pulse">
      <td className="px-4 py-3">
        <div className="h-3 w-8 rounded bg-slate-200" />
      </td>
      <td className="px-4 py-3">
        <div className="h-4 w-36 rounded bg-slate-200" />
        <div className="mt-2 h-3 w-28 rounded bg-slate-100" />
      </td>
      <td className="px-4 py-3">
        <div className="h-5 w-20 rounded-md bg-slate-100" />
      </td>
      <td className="px-4 py-3">
        <div className="h-3 w-40 rounded bg-slate-100" />
      </td>
      <td className="px-4 py-3">
        <div className="h-3 w-8 rounded bg-slate-200" />
      </td>
      <td className="px-4 py-3">
        <div className="h-5 w-20 rounded-full bg-slate-100" />
      </td>
      <td className="px-4 py-3">
        <div className="h-5 w-20 rounded-full bg-slate-100" />
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1.5">
          <div className="h-6 w-6 rounded bg-slate-200" />
          <div className="h-6 w-6 rounded bg-slate-200" />
          <div className="h-6 w-6 rounded bg-slate-200" />
        </div>
      </td>
    </tr>
  ));

export default LowonganTableSkeletonRows;

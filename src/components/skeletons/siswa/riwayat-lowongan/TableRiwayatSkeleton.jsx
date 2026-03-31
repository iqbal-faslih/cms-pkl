const TableRiwayatSkeleton = ({ rows = 6 }) => {
  return (
    <div className="pb-30">
      <table className="w-full divide-y divide-gray-200">
        <thead className="bg-[#DFE8FF] h-15">
          <tr className="text-left">
            <th className="font-medium px-4 py-2 text-center">
              <div className="h-4 w-10 bg-gray-300 rounded animate-pulse mx-auto" />
            </th>
            <th className="font-medium px-4 py-2">
              <div className="h-4 w-36 bg-gray-300 rounded animate-pulse" />
            </th>
            <th className="font-medium px-4 py-2">
              <div className="h-4 w-32 bg-gray-300 rounded animate-pulse" />
            </th>
            <th className="font-medium px-4 py-2">
              <div className="h-4 w-28 bg-gray-300 rounded animate-pulse" />
            </th>
            <th className="font-medium px-4 py-2">
              <div className="h-4 w-14 bg-gray-300 rounded animate-pulse" />
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-300">
          {Array.from({ length: rows }, (_, index) => (
            <tr key={index} className="text-sm">
              <td className="px-4 py-2 text-center">
                <div className="h-4 w-6 bg-gray-300 rounded animate-pulse mx-auto" />
              </td>

              <td className="px-4 py-2 align-middle">
                <div className="flex items-center gap-5">
                  <div className="size-10 bg-gray-300 rounded-full animate-pulse" />
                  <div className="h-4 w-40 bg-gray-300 rounded animate-pulse" />
                </div>
              </td>

              <td className="px-4 py-2">
                <div className="h-4 w-28 bg-gray-300 rounded animate-pulse" />
              </td>

              <td className="px-4 py-2">
                <div className="h-4 w-24 bg-gray-300 rounded animate-pulse" />
              </td>

              <td className="px-4 py-2">
                <div className="h-9 w-24 bg-gray-300 rounded-md animate-pulse" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableRiwayatSkeleton;

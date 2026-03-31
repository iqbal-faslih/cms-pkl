import React from "react";

export default function ProjectListing({ projects }) {
  const finishedProjects = projects?.filter((project) => project.selesai);

  return (
    <div className="w-full h-full max-h-[500px] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pb-4">
      <div className="flex items-center mb-6">
        <h1 className="text-xl font-bold text-gray-800">Riwayat Projek</h1>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full divide-y divide-gray-200">
          <thead className="bg-[#DFE8FF] h-15">
            <tr>
              <th className="px-4 py-2 text-left font-medium text-gray-700">
                Tahap
              </th>
              <th className="px-4 py-2 text-left font-medium text-gray-700">
                Mulai
              </th>
              <th className="px-4 py-2 text-left font-medium text-gray-700">
                Selesai
              </th>
              <th className="px-4 py-2 text-center font-medium text-gray-700">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {finishedProjects?.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="text-center py-6 text-gray-500 italic"
                >
                  Belum ada projek yang diselesaikan
                </td>
              </tr>
            ) : (
              finishedProjects.map((project) => (
                <tr key={project.id_route} className="hover:bg-gray-50">
                  <td className="px-4 py-2 font-medium capitalize text-gray-800">
                    {project.kategori}
                  </td>
                  <td className="px-4 py-2 font-medium text-green-600">
                    {project.mulai}
                  </td>
                  <td className="px-4 py-2 font-medium text-red-600">
                    {project.selesai}
                  </td>
                  <td className="px-4 py-2 font-medium flex items-center">
                    <span className="inline-block bg-green-600 px-3 py-2 rounded-md text-white text-sm font-medium">
                      Selesai
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

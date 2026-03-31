import React from "react";
import Card from "../../../cards/Card";

const DashboardSkeleton = () => {
  return (
    <div className="flex flex-col gap-4 overflow-x-hidden transition-all duration-300 h-full w-full">
      <div className="grid grid-cols-20 gap-3">
        <Card className="col-span-15">
          <div className="grid grid-cols-4 gap-2 w-full">
            {[...Array(4)].map((_, index) => (
              <div
                key={index}
                className={`bg-gray-300/30 animate-pulse duration-300 rounded-lg py-3 px-4 w-full h-[147px] transition-all ease-in-out`}
              >
                <div className="size-12 bg-gray-300 animate-pulse duration-300 rounded-full flex justify-center items-center"></div>

                <div className="mt-4">
                  <div className="space-y-1">
                    <div className="w-30 h-4 rounded-lg bg-gray-300 animate-pulse duration-300"></div>
                    <div className="w-15 h-3 rounded-lg bg-gray-300 animate-pulse duration-300"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card className="col-span-5">
          <div className="flex gap-3 items-center">
            <div className="size-20 rounded-full border-2 border-dashed border-gray-300 p-1">
              <div className="size-full object-cover rounded-full bg-gray-300 animate-pulse duration-300 aspect-square" />
            </div>
            <div className="space-y-1.5 min-w-0">
              <div className="w-28 h-4 rounded-full bg-gray-300 animate-pulse duration-300"></div>
              <div className="w-28 h-3 rounded-lg bg-gray-300 animate-pulse duration-300"></div>
              <div className="w-16 h-4 bg-gray-300 animate-pulse duration-300 rounded-full"></div>
            </div>
          </div>
        </Card>
      </div>
      <div className="grid grid-cols-12 gap-3 h-full">
        <Card className="col-span-4">
          <div className="bg-white w-full h-full">
            <div className="flex justify-between items-center mb-6">
              <div className="w-40 h-8 bg-gray-300 rounded-lg animate-pulse duration-300"></div>
              <div className="bg-gray-300 rounded-lg w-20 h-5 animate-pulse duration-300"></div>
            </div>

            <div className="flex justify-center mb-6 space-x-2">
              <div
                className={`w-30 h-7 rounded-lg bg-gray-300 animate-pulse duration-300`}
              ></div>
              <div
                className={`w-30 h-7 rounded-lg bg-gray-300 animate-pulse duration-300`}
              ></div>
            </div>

            <div className="w-full h-96 rounded-lg border border-gray-300 animate-pulse duration-300" />
          </div>
        </Card>
        <div className="flex flex-col gap-3 col-span-8 h-full">
          <Card className="h-full">
            <div className="w-full h-full max-h-[500px] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pb-4">
              <div className="flex items-center mb-6">
                <div className="w-40 h-8 bg-gray-300 rounded-lg animate-pulse duration-300"></div>
              </div>

              <div className="overflow-x-auto animate-pulse">
                <table className="w-full divide-y divide-gray-200">
                  <thead className="bg-[#DFE8FF] h-15">
                    <tr>
                      <th className="px-4 py-2 text-left font-medium text-gray-700">
                        <div className="h-4 w-24 bg-gray-300 rounded animate-pulse" />
                      </th>
                      <th className="px-4 py-2 text-left font-medium text-gray-700">
                        <div className="h-4 w-20 bg-gray-300 rounded animate-pulse" />
                      </th>
                      <th className="px-4 py-2 text-left font-medium text-gray-700">
                        <div className="h-4 w-20 bg-gray-300 rounded animate-pulse" />
                      </th>
                      <th className="px-4 py-2 text-left font-medium text-gray-700">
                        <div className="h-4 w-20 bg-gray-300 rounded animate-pulse" />
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: 4 }).map((_, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-4 py-2">
                          <div className="h-4 w-24 bg-gray-300 rounded"></div>
                        </td>
                        <td className="px-4 py-2">
                          <div className="h-4 w-20 bg-gray-300 rounded"></div>
                        </td>
                        <td className="px-4 py-2">
                          <div className="h-4 w-20 bg-gray-300 rounded"></div>
                        </td>
                        <td className="px-4 py-2">
                          <div className="h-6 w-24 bg-gray-300 rounded-md"></div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
          <Card>
            <div className="w-full h-full p-2">
              <div className="w-40 h-8 bg-gray-300 rounded-lg animate-pulse duration-300 mb-3"></div>
              <div className="border border-gray-300 rounded-md p-4">
                <div className="animate-pulse">
                  <div className="flex items-center mb-4">
                    <div className="bg-gray-300 rounded-full w-12 h-12 mr-5"></div>
                    <div className="bg-gray-300 h-4 w-32 rounded"></div>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-gray-300 h-3 w-full rounded"></div>
                    <div className="bg-gray-300 h-3 w-3/4 rounded"></div>
                    <div className="bg-gray-300 h-3 w-1/2 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardSkeleton;

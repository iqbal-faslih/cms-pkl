import React from "react";
import { dashboardDummy } from "@/shared/dummy/Mentor/DashboardDummy";

const CardRiwayat = () => {
  const data = dashboardDummy.riwayat;

  return (
    <div className="bg-white p-10 rounded-xl shadow-md w-full h-full flex flex-col">
      <h2 className="text-2xl font-semibold mb-8">{data.tanggal}</h2>

      <div className="flex-1 flex flex-col gap-4 overflow-y-auto">
        {data.list.map((item, i) => (
          <div key={i} className="flex justify-between items-center">
            <div className="flex flex-col text-sm ml-1 text-gray-600 leading-tight">
                <span>{item.start}</span>
                <span>{item.end}</span>
            </div>

            <div className="w-px h-6 bg-gray-300 mx-4 ml-7" />

            <div>
              <p className="font-medium">{item.title}</p>

              <span
                className={`text-xs px-2 py-1 rounded-md 
                  ${item.status === "Dipending"
                    ? "bg-red-100 text-red-600"
                    : "bg-blue-100 text-blue-600"}`}
              >
                {item.status}
              </span>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default CardRiwayat;
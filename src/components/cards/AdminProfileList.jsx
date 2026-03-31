import React from "react";
import { User } from "lucide-react";
import { adminsDummy } from "../../pages/superadmin/dashboard/dummies";

export default function AdminOnlineList() {
  const admins = adminsDummy;

  return (
    <div className="w-full lg:w-64 bg-white rounded-lg shadow-sm
                    p-3 md:p-4">

      {/* TITLE */}
      <h2 className="
        text-xs md:text-sm font-semibold text-gray-800
        mb-3 md:mb-4
      ">
        Admin Online Sekarang
      </h2>

      {/* LIST */}
      <div className="space-y-3 md:space-y-5">
        {admins.map((admin) => (
          <div key={admin.id} className="flex items-center gap-2 md:gap-3">

            {/* AVATAR */}
            <div
              className={`
                ${admin.color}
                rounded-full
                p-1.5 md:p-2
                flex items-center justify-center
              `}
            >
              <User
                className="w-4 h-4 md:w-5 md:h-5 text-white"
                strokeWidth={2.5}
              />
            </div>

            {/* TEXT */}
            <div className="flex-1">
              <div className="text-xs md:text-sm font-medium text-gray-800">
                {admin.name}
              </div>
              <div className="text-[10px] md:text-xs text-gray-500">
                {admin.role}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import React from "react";
import { Settings, Calendar, Puzzle } from "lucide-react";

export default function NotificationSystem() {
  const notifications = [
    {
      icon: <Settings className="w-6 h-6" />,
      title: "Sistem Update ke versi 2.3",
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Maintenance: 15 Nov 2026",
    },
    {
      icon: <Puzzle className="w-6 h-6" />,
      title: "Fitur baru. Export Data Otomatis",
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm p-8 w-full h-auto xl:h-80">
      <h1 className="text-xl font-bold text-gray-900 mb-10">
        Notifikasi Sistem
      </h1>

      <div className="space-y-6">
        {notifications.map((notification, index) => (
          <div key={index} className="flex items-start gap-6">
            <div className="text-gray-900 flex-shrink-0">
              {notification.icon}
            </div>
            <div className="flex-1">
              <p className="text-gray-500 text-[0.8rem] leading-relaxed pb-4">
                {notification.title}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

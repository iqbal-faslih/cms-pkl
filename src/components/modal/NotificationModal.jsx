import React from "react";
import { MessageSquareText, CheckCheck } from 'lucide-react';

const getColorClass = (type) => {
  switch (type) {
    case "success":
      return "bg-green-100 text-green-500";
    case "warning":
      return "bg-red-100 text-red-500";
    case "info":
      return "bg-yellow-100 text-yellow-500";
    default:
      return "bg-gray-100 text-gray-500";
  }
};

const NotificationModal = ({ isOpen, onClose, notifications, markAllAsRead, markAsRead }) => {
  if (!isOpen) return null;

  const groupedNotifications = notifications.reduce((acc, notif) => {
    const date = notif.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(notif);
    return acc;
  }, {});

  const unreadCount = notifications.filter(notif => !notif.read).length;

  return (
    <div className="absolute top-full mt-4 right-0 bg-white shadow-xl rounded-lg p-4 w-96 z-50 max-h-[70vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-4 border-b pb-2">
        <h3 className="font-bold text-xl">Notifications <span className="text-sm bg-blue-500 text-white rounded-full px-2 py-1 ml-2">{unreadCount}</span></h3>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-3xl leading-none">&times;</button>
      </div>

      {Object.entries(groupedNotifications).map(([date, notifs]) => (
        <div key={date}>
          <h4 className="font-semibold text-gray-700 my-3">{date}</h4>
          <div className="space-y-4">
            {notifs.map((notif) => {
              const colorClass = getColorClass(notif.type);
              const isRead = notif.read;

              return (
                <div 
                  key={notif.id} 
                  className={`flex items-start gap-3 border-b pb-4 ${isRead ? "opacity-60" : "cursor-pointer"}`}
                  onClick={() => !isRead && markAsRead(notif.id)} 
                >
                  <div className={`size-10 rounded-full flex items-center justify-center ${isRead ? "bg-gray-100" : colorClass}`}>
                    <MessageSquareText className={isRead ? "text-gray-500" : "size-6"} />
                  </div>
                  <div className="flex-1">
                    <h5 className={`font-medium ${isRead ? "text-gray-400" : ""}`}>{notif.title}</h5>
                    <p className={`text-sm ${isRead ? "text-gray-400" : "text-gray-600"} mt-1`}>{notif.desc}</p>
                  </div>
                  <span className={`text-xs ${isRead ? "text-gray-300" : "text-gray-400"} whitespace-nowrap`}>{notif.time}</span>
                </div>
              );
            })}
          </div>
        </div>
      ))}
      
      <div className="mt-4 text-center border-t pt-4">
        <button 
          onClick={markAllAsRead} 
          className="text-blue-500 text-sm hover:underline flex items-center gap-2 justify-center w-full"
        >
          <CheckCheck className="text-blue-500" /> Mark all as read
        </button>
      </div>
    </div>
  );
};

export default NotificationModal;
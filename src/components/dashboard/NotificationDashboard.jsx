import { useState, useEffect } from "react";
import { useNotifications } from "../../hooks/useNotifications";
import NotificationModal from "../modal/NotificationModal";

const NotificationDashboard = () => {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const { unreadCount, markAllAsRead, notifications, markAsRead } =
    useNotifications();
  const [isRinging, setIsRinging] = useState(false);

  const toggleNotification = () => {
    setIsNotificationOpen(!isNotificationOpen);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setIsRinging(true);
      setTimeout(() => setIsRinging(false), 800);
    }, 3000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div
      className="size-10 rounded-md bg-orange-50 flex justify-center relative items-center cursor-pointer"
      onClick={toggleNotification}
    >
      <span className="bg-red-500 text-white size-5 rounded-full flex items-center justify-center text-xs absolute top-0 right-0">
        {unreadCount}
      </span>
      <div className="bg-red-500 size-1 rounded-full absolute top-1 right-2 animate-ping"></div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
      >
        <g fill="none" fillRule="evenodd">
          <path d="m12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z" />
          <path
            fill="currentColor"
            d="M5 9a7 7 0 0 1 14 0v3.764l1.822 3.644A1.1 1.1 0 0 1 19.838 18h-3.964a4.002 4.002 0 0 1-7.748 0H4.162a1.1 1.1 0 0 1-.984-1.592L5 12.764zm5.268 9a2 2 0 0 0 3.464 0zM12 4a5 5 0 0 0-5 5v3.764a2 2 0 0 1-.211.894L5.619 16h12.763l-1.17-2.342a2 2 0 0 1-.212-.894V9a5 5 0 0 0-5-5"
            className={`text-yellow-400 font-light text-sm ${
              isRinging ? "bell-shake" : ""
            }`}
          />
        </g>
      </svg>

      <NotificationModal
        isOpen={isNotificationOpen}
        onClose={toggleNotification}
        notifications={notifications}
        markAllAsRead={markAllAsRead}
        markAsRead={markAsRead}
      />
    </div>
  );
};

export default NotificationDashboard;

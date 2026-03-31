import { useState, useEffect } from "react";
import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead } from "../helpers/apiClient"

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await getNotifications();
      const raw = response?.data;
      const list = Array.isArray(raw) ? raw : raw?.data || [];

      const notificationsData = list.map((n) => ({
        // normalize read flag: prefer `read`, fallback to `is_read` or `status`
        ...n,
        read:
          typeof n.read === "boolean"
            ? n.read
            : typeof n.is_read === "boolean"
            ? n.is_read
            : n.status === "read" || n.status === "sudah" || false,
      }));

      setNotifications(notificationsData);
      setError(null);
    } catch (err) {
      const status = err?.response?.status;
      if (status === 404) {
        // Endpoint belum tersedia / tidak ada notifikasi
        setNotifications([]);
        setError(null);
      } else {
        console.error("Gagal mengambil notifikasi:", err);
        setError("Gagal memuat notifikasi. Coba lagi nanti.");
        setNotifications([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (id) => {
    try {
      await markNotificationAsRead(id);
      setNotifications(prev =>
        prev.map(notif =>
          notif.id === id ? { ...notif, read: true } : notif
        )
      );
    } catch (err) {
      console.error("Gagal menandai notifikasi sebagai sudah dibaca:", err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications(prev =>
        prev.map(notif => ({ ...notif, read: true }))
      );
    } catch (err) {
      console.error("Gagal menandai semua notifikasi sebagai sudah dibaca:", err);
    }
  };

  const unreadCount = Array.isArray(notifications) ? notifications.filter(notif => !notif.read).length : 0;

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    loading,
    error,
    refreshNotifications: fetchNotifications 
  };
};

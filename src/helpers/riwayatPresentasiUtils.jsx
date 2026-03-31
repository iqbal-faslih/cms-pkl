
export const highlightSearchTerm = (text, searchTerm) => {
  if (!searchTerm || !text) return text;
  const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);
  return parts.map((part, index) =>
    regex.test(part) ? <mark key={index} className="bg-yellow-200 px-1 rounded">{part}</mark> : part
  );
};

export const getStatusStyle = (status) => {
  const styles = {
    "Dijadwalkan": { dot: "bg-orange-400", text: "text-orange-500" },
    "Selesai": { dot: "bg-green-400", text: "text-green-500" },
    "Tertunda": { dot: "bg-yellow-400", text: "text-yellow-600" },
    "Dibatalkan": { dot: "bg-red-400", text: "text-red-500" }
  };
  return styles[status] || { dot: "bg-gray-400", text: "text-gray-500" };
};

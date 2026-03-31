import { MoreHorizontal } from "lucide-react";

const TrackCard = ({
  route,
  task,
  task_status,
  date,
  color,
  color2,
  buttonLabel,
  onButtonClick,
  onEllipsisClick,
}) => {
  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: color }}
          />
          <span className="text-sm font-medium text-gray-700">{route}</span>
        </div>
        <h4 className="text-base font-semibold text-gray-900 mb-1">{task}</h4>
        <p className="text-sm text-gray-500">{date}</p>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onButtonClick}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            task_status === "completed"
              ? "bg-green-100 text-green-700 hover:bg-green-200"
              : task_status === "in_work"
              ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
              : "bg-orange-100 text-orange-700 hover:bg-orange-200"
          }`}
          style={{ backgroundColor: color2 }}
        >
          {buttonLabel}
        </button>

        <button
          onClick={onEllipsisClick}
          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <MoreHorizontal size={16} />
        </button>
      </div>
    </div>
  );
};

export default TrackCard;

import Badge2 from "../../../shared/components/Badge2";
import { Calendar, Ellipsis } from "lucide-react";
import Button from "../../../components/Button";

const TrackCard = ({
  route,
  task,
  task_status,
  date,
  color,
  color2,
  onEllipsisClick,
  buttonLabel,
  btnClassName,
  onButtonClick,
}) => {
  return (
    <div
      className={`p-2 rounded-md border max-w-full border-gray-200`}
      style={{
        backgroundColor: color,
      }}
    >
      <div className="flex px-4 font-semibold items-center justify-between text-white">
        <h3 className="capitalize ">{route}</h3>
        <button onClick={onEllipsisClick}>
          <Ellipsis size={20} />
        </button>
      </div>
      <div
        className="text-sm p-2 mt-2 font-medium rounded-md bg-[#F0F4FF]"
        style={{
          color: color,
        }}
      >
        <p className="font-light">{task}</p>
        <div className="flex items-center justify-between mt-3">
          <Badge2
            rounded="4px"
            textSize="12px"
            px="8px"
            color={color2}
            textColor={color}
            className={"capitalize"}
          >
            {task_status}
          </Badge2>
          <div className="flex items-center gap-1">
            <Calendar size={14} />
            <span className="text-xs opacity-70">{date}</span>
          </div>
        </div>
      </div>
      <Button
        onClick={onButtonClick}
        className={`mt-2 text-white text-sm uppercase font-medium mx-auto flex ${btnClassName}`}
      >
        {buttonLabel}
      </Button>
    </div>
  );
};

export default TrackCard;

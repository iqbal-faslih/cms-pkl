import React from "react";
import { Icon } from "@iconify/react";

const Card = ({ color = "bg-blue-500", icon, title, count }) => {
  return (
    <div className={`${color} w-full rounded-xl flex flex-col items-center justify-center py-4 shadow-md text-white`}>
      <div className="text-5xl mb-4">
        <Icon icon={icon} />
      </div>

      <span className="text-3xl font-bold leading-none">{count}</span>
      <span className="text-lg mt-1">{title}</span>
    </div>
  );
};

export default Card;

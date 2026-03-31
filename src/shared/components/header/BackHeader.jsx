import React from "react";
import BackButton from "../button/BackButton";

const BackHeader = ({ size, title, textSize = 30, backTo }) => {
  return (
    <div className="flex items-center gap-13">
      <BackButton size={size} backTo={backTo} />
      <h2 className={`font-semibold text-[${textSize}px]`}>{title}</h2>
    </div>
  );
};

export default BackHeader;
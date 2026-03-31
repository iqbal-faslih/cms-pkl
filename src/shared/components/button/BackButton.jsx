import React from "react";
import { useNavigate } from "react-router-dom";
import { BsArrowLeft } from "react-icons/bs";
import { ArrowLeft } from "lucide-react";

const BackButton = ({ size = 30, backTo = -1 }) => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(backTo)}
      className="cursor-pointer"
    >
      <ArrowLeft size={size} />
    </button>
  );
};

export default BackButton;

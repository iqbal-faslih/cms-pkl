import React from "react";

const SquaredProfile = ({ image, size = "20px" }) => {
  return (
      <div
        className={`rounded-md bg-gray-400 overflow-hidden`}
        style={{
          width: size,
          height: size,
        }}
      >
        <img src={image} alt="Foto Profil" className="size-full object-cover" />
      </div>
  );
};

export default SquaredProfile;

import React, { useEffect, useMemo, useState } from "react";

const RoundedProfile = ({
  image,
  size = "176px",
  borderColor = "#306BFF",
  fallbackImage = "/assets/img/defaultPP.png",
}) => {
  const resolvedInitialImage = useMemo(
    () => image || (typeof fallbackImage === "string" ? fallbackImage : ""),
    [image, fallbackImage]
  );
  const [currentImage, setCurrentImage] = useState(resolvedInitialImage);
  const [hasImageError, setHasImageError] = useState(false);

  useEffect(() => {
    // Keep state in sync when parent image changes.
    setCurrentImage(resolvedInitialImage);
    setHasImageError(false);
  }, [resolvedInitialImage]);

  return (
    <div
      className="p-2 rounded-full relative border-[1px]"
      style={{ borderColor: borderColor }}
    >
      <div
        className={`rounded-full bg-gray-400 border-[1px] overflow-hidden`}
        style={{
          borderColor: borderColor,
          width: size,
          height: size,
        }}
      >
        {currentImage && !hasImageError ? (
          <img
            src={currentImage}
            alt="Foto Profil"
            className="size-full object-cover"
            onError={() => {
              if (typeof fallbackImage === "string" && fallbackImage.trim()) {
                setCurrentImage(fallbackImage);
              } else {
                setHasImageError(true);
              }
            }}
          />
        ) : (
          <div className="size-full bg-gray-300" />
        )}
      </div>
    </div>
  );
};

export default RoundedProfile;

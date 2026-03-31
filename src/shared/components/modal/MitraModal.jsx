import React from "react";
import { X } from "lucide-react";

const DetailListModal = ({
  isOpen = false,
  onClose = () => {},
  backgroundUrl = "/default-bg.jpg",
  avatarUrl = "",
  avatarSize = 96,

  title = "Title",
  subtitle = "",
  extraInfo = [], // contoh: [{ label: "Email", value: "email@gmail.com" }]

  listTitle = "List",
  items = [], // List data
  itemActionLabel = "Action",
  onItemAction = () => {},
  itemActionIcon: ActionIcon = null,

  width = "max-w-lg",
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div
        className={`bg-white rounded-2xl w-full ${width} shadow-lg overflow-hidden relative animate-fadeIn`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition"
        >
          <X size={22} />
        </button>

        {/* Header with Background */}
        <div
          className="h-36 bg-cover bg-center relative"
          style={{
            backgroundImage: `url(${backgroundUrl})`,
          }}
        >
          <div className="absolute inset-0 bg-black/40" />

          {/* Avatar */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
            <img
              src={avatarUrl}
              alt="Avatar"
              className={`rounded-full border-4 border-white object-cover shadow-lg`}
              style={{
                width: avatarSize,
                height: avatarSize,
              }}
            />
          </div>
        </div>

        {/* Body */}
        <div className="pt-16 pb-8 px-6 text-center">
          {/* Title & Subtitle */}
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}

          {/* Extra Info Section */}
          <div className="mt-3 space-y-1">
            {extraInfo.map((info, idx) => (
              <p key={idx} className="text-sm text-gray-700">
                <span className="font-medium">{info.label}: </span>
                {info.value}
              </p>
            ))}
          </div>

          {/* List Section */}
          <div className="text-left mt-6">
            <h3 className="text-base font-semibold text-gray-800 mb-3">
              {listTitle}
            </h3>

            <div className="space-y-2">
              {items.length ? (
                items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-50 hover:bg-gray-100 px-4 py-2 rounded-md border border-gray-200"
                  >
                    <span className="text-sm text-gray-800">
                      {index + 1}. {item}
                    </span>

                    {/* Action Button */}
                    {onItemAction && (
                      <button
                        onClick={() => onItemAction(item)}
                        className="flex items-center gap-1 text-red-500 hover:text-red-700 text-sm"
                      >
                        {ActionIcon && <ActionIcon size={14} />}
                        {itemActionLabel}
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">Tidak ada data.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailListModal;

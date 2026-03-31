const PresentationCard = ({
  item,
  onButtonClick,
  buttonLabel = "Action",
  buttonDisabled = false,
  buttonVariant = "outline",
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
      <div className="relative h-28 flex justify-between items-start">
        <img
          src={item.backgroundImage}
          alt="Presentation background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-10 w-full p-4 flex justify-between items-start">
          <h3 className="text-lg font-semibold text-white">
            Presentasi {item.tipe}
          </h3>
        </div>
      </div>

      {item.status && (
        <div className="p-2 border-b border-[#667797] flex justify-between items-center">
          <span
            className={`px-3 py-1 text-xs font-medium rounded-full text-white ${
              item.status === "Selesai"
                ? "bg-[#5CA5FF]"
                : item.status === "Berlangsung"
                ? "bg-blue-200"
                : item.status === "Dibatalkan"
                ? "bg-red-200"
                : item.status === "Kadaluarsa"
                ? "bg-gray-300"
                : "bg-[#FFC77D]"
            }`}
          >
            {item.status}
          </span>
          <div className="flex items-center text-gray-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1 text-blue-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.661.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
            </svg>
            <span className="text-xs font-medium">
              {item.applicants || 0} orang
            </span>
          </div>
        </div>
      )}

      <div className="p-2">
        <div className="mb-4 space-y-2">
          <div className="flex items-center justify-between text-gray-600 text-xs">
            <div className="flex items-center max-w-[100px]">
              <i className="bi bi-calendar3 mr-1 text-[#0069AB]"></i>
              <span className="line-clamp-1">{item.date}</span>
            </div>
            <div className="flex items-center line-clamp-1">
              <i className="bi bi-clock mr-1 text-[#0069AB]"></i>
              <span>{item.time}</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => onButtonClick?.(item)}
          disabled={buttonDisabled}
          className={`w-full py-2 px-4 text-sm font-medium rounded-full transition-colors duration-200 ${
            buttonDisabled
              ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
              : buttonVariant === "outline"
              ? "border border-[#0069AB] text-[#0069AB] hover:bg-[#0069AB] hover:text-white"
              : "border border-[#0069AB] text-[#0069AB] hover:bg-[#0069AB] hover:text-white"
          }`}
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  );
};

export default PresentationCard;

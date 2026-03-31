import { usePresentation } from "../../../hooks";

const PresentationCard = ({ item, onButtonClick }) => {
  const { getButtonProps } = usePresentation();
  const buttonProps = getButtonProps(item);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
      <div className="relative h-28 flex justify-between items-start">
        <img 
          src={item.backgroundImage} 
          alt="Presentation background" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        <div className="relative z-10 w-full p-4 flex justify-between items-start">
          <h3 className="text-lg font-semibold text-black">
            Presentasi {item.tipe}
          </h3>
        </div>
      </div>

      {item.status && (
        <div className="py-2 px-4 border-b border-[#667797] flex justify-between items-center">
          <span className={`px-2 py-1 text-xs font-medium rounded text-black ${
            item.status === "Selesai" ? "bg-[#83FFB1]" : "bg-[#FFE0CB]"
          }`}>
            {item.status}
          </span>
        </div>
      )}

      <div className="p-4">
        <div className="mb-4">
          <div className="flex items-center justify-between text-gray-600" style={{ fontSize: '0.65rem' }}>
            <div className="flex items-center">
              <i className="bi bi-calendar3 mr-1"></i>
              <span>{item.date}</span>
            </div>
            <div className="flex items-center">
              <i className="bi bi-clock mr-1"></i>
              <span>{item.time}</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => onButtonClick?.(item)}
          disabled={buttonProps.disabled}
          className={`w-full py-2 px-4 text-sm font-medium rounded-full transition-colors duration-200 ${
            buttonProps.disabled
              ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
              : buttonProps.variant === 'outline'
              ? "border border-[#0069AB] text-[#0069AB] hover:bg-[#0069AB] hover:text-white"
              : "border border-[#0069AB] text-[#0069AB] hover:bg-[#0069AB] hover:text-white"
          }`}
        >
          {buttonProps.label}
        </button>
      </div>
    </div>
  );
};

export default PresentationCard; 
import React from "react";
import { Link } from "react-router-dom"; 
import checkAwalIcon from "/assets/icons/check-awal.png";
import tahapProsesIcon from "/assets/icons/tahap-proses.png";
import tahapKunciIcon from "/assets/icons/tahap-kunci.png"; 


const statusInfo = {
  completed: { icon: checkAwalIcon, alt: 'Tahap Selesai', class: 'bg-[#16A34A]' },
  active: { icon: tahapProsesIcon, alt: 'Tahap Aktif', class: 'bg-[#FF8C00]' },
  locked: { icon: tahapKunciIcon, alt: 'Tahap Terkunci', class: 'bg-[#A1A2A5]' },
};

const CardRoute = ({stage, status}) => {
  const { icon, alt, class: statusClass, isLocked, isCompleted, isActive } = status;

  let currentStatus;
  if (isCompleted) currentStatus = statusInfo.completed;
  else if (isActive) currentStatus = statusInfo.active;
  else if (isLocked) currentStatus = statusInfo.locked;

  if (!currentStatus) return null;

  const getActionButton = () => {
    const buttonClasses = "w-8 h-8 flex items-center justify-center p-2 rounded-lg bg-white shadow-md transition-transform duration-200 transform hover:scale-110";

    if (isCompleted || isActive) {
      return (
        <Link to={`/detail-project/${stage.id}`} className={buttonClasses}>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd" />
            <path fillRule="evenodd" d="M3 10a1 1 0 011-1h9a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
        </Link>
      );
    } else if (isLocked) {
      return (
        <div className={`${buttonClasses} cursor-not-allowed`}>
          <svg viewBox="0 0 18 21" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-500 opacity-70">
            <path d="M3 8.94891V18.304H16V8.94891H3ZM15 7.07788H17C17.5523 7.07788 18 7.49673 18 8.0134V19.2395C18 19.7562 17.5523 20.1751 17 20.1751H1C0.44772 20.1751 0 19.7562 0 19.2395V8.0134C0 7.49673 0.44772 7.07788 1 7.07788H3V6.14237C3 3.04235 5.68629 0.529297 9 0.529297C12.3137 0.529297 15 3.04235 15 6.14237V7.07788ZM13 7.07788V6.14237C13 4.07569 11.2091 2.40032 9 2.40032C6.79086 2.40032 5 4.07569 5 6.14237V7.07788H13ZM4 9.88442H6V11.7554H4V9.88442ZM4 12.691H6V14.562H4V12.691ZM4 15.4975H6V17.3685H4V15.4975Z" />
          </svg>
        </div>
      );
    }
    return null;
  };
  return (
    <div className={`relative p-3 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105  ${statusClass}`}>
      <div className="bg-white p-6 rounded-lg text-center mb-4">
        <img src={icon} alt={alt} className="w-16 h-16 mx-auto mb-4" />

        <h3 className="text-xl font-bold text-gray-800 mb-2">
          {stage.title}
        </h3>
        
        <p className={`text-sm mt-1 mb-2 ${isLocked ? "text-gray-500" : "text-gray-600"}`}>
          {stage.description}
        </p>

        {!isLocked && (
          <p className="text-xs text-gray-500">{stage.dates}</p>
        )}
      </div>
      <div className="mt-auto flex justify-between items-center w-full">
        <div className="flex flex-col">
          <span className="text-white">
            Detail Project
          </span>
        </div>
        {getActionButton()}
      </div>
    </div>
  );
};

export default CardRoute;
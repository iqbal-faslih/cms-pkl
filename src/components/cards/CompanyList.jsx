import React, { useState } from 'react';
import { MoreVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { companyData_2 } from '../../pages/superadmin/dashboard/dummies';

const CompanyList = () => {
  const navigate = useNavigate();
  const [openMenus, setOpenMenus] = useState({});
  const companies = companyData_2

  return (
    <div className="w-full mx-auto bg-white h-192 rounded-xl border border-gray-200 shadow-sm">
      
      {/* Header */}
      <div className="flex justify-between items-center p-5 pb-2 border-b border-gray-200">
        <h1 className="text-lg font-semibold text-gray-800">Perusahaan terdaftar</h1>
        <button
          className="text-blue-500 text-xs font-medium"
          onClick={() => navigate('/superadmin/manajemen-perusahaan')}
        >
          See All
        </button>
      </div>

      {/* Company List */}
      <div className="divide-y-1 divide-gray-200">
        {companies.map((company) => (
          <div 
  key={company.id} 
  className="flex items-center gap-4 px-4 py-4.5 hover:bg-gray-50 transition-colors"
>


            {/* Profile Picture */}
            <div className="flex">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-cyan-100 to-cyan-200 flex items-center justify-center overflow-hidden">
                <svg 
                  className="w-7 h-7 text-cyan-500" 
                  viewBox="0 0 24 24" 
                  fill="currentColor"
                >
                  <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                </svg>
              </div>
            </div>

            {/* Company Info */}
            <div className="flex-1 min-w-0">
              <h3 
                className="font-semibold text-gray-900 text-xs truncate"
                title={company.name}  // 🔥 Tooltip muncul saat cursor hover
              >
                {company.name}
              </h3>

              <p className="text-[10px] text-gray-500 mt-0.5">
                {company.location}
              </p>

              <p className="text-[10px] text-gray-600 mt-0.5">
                {company.applicants}
              </p>
            </div>

            {/* Menu Button */}
            <div className="relative">
              <button
                className="flex-shrink-0 p-1 hover:bg-gray-100 rounded-full transition-colors"
                onClick={() => setOpenMenus(prev => prev[company.id] ? {} : { [company.id]: true })}
              >
                <MoreVertical className="w-5 h-5 text-gray-400" />
              </button>

              {openMenus[company.id] && (
                <div className="absolute right-0 mt-1 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                  <button
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => {
                      navigate(`/superadmin/manajemen-perusahaan/${company.id}/detail-perusahaan`);
                      setOpenMenus({});
                    }}
                  >
                    Lihat Detail
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompanyList;

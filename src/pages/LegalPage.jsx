import React from "react";
import { useLegalPageLogic } from "../hooks/useLegalPage";
import { LegalPages } from "../components/LegalPages";

function LegalPage() {
  const { currentPage, handlePageChange } = useLegalPageLogic();

  return (
    <div className="font-sans bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-5 xl:px-0 py-12">
        <div className="bg-gray-50 rounded-lg p-8 md:p-12 shadow-md">
          <div className="flex space-x-4 mb-8 border-b-2 pb-4">
            <button
              onClick={() => handlePageChange('terms')}
              className={`font-semibold text-lg pb-2 transition-colors duration-300 ${
                currentPage === 'terms' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Syarat & Ketentuan
            </button>
            <button
              onClick={() => handlePageChange('privacy')}
              className={`font-semibold text-lg pb-2 transition-colors duration-300 ${
                currentPage === 'privacy' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Kebijakan Privasi
            </button>
          </div>

          <LegalPages page={currentPage} />
        </div>
      </div>
    </div>
  );
}

export default LegalPage;
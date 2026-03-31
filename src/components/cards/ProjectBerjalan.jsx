import { Link } from 'react-router-dom';
import { formatSimpleDate } from '../../utils/dateUtils';
import { calculateRouteProgress } from '../../helpers/siswa/dashboard/dashboardHelper';

export default function ProjectCard({ data }) {

  const allRoutes = data;
  const activeRoute = allRoutes.find((route) => !route.selesai) || null;

  if (!activeRoute && allRoutes?.length === 0) {
    return (
      <div className="w-full h-full p-2">
        <h1 className="text-xl font-bold text-gray-800 mb-3">Project sedang berjalan</h1>
        <div className="border border-gray-300 rounded-md p-4 bg-gray-50">
          <div className="text-center py-8">
            <div className="bg-gray-200 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="#6b7280"
                viewBox="0 0 16 16"
              >
                <path d="M8.211 2.047a.5.5 0 0 0-.422 0l-7.5 3.5a.5.5 0 0 0 .025.917l7.5 3a.5.5 0 0 0 .372 0L14 7.14V13a1 1 0 0 0-1 1v2h3v-2a1 1 0 0 0-1-1V6.739l.686-.275a.5.5 0 0 0 .025-.917l-7.5-3.5Z"/>
                <path d="M4.176 9.032a.5.5 0 0 0-.656.327l-.5 1.7a.5.5 0 0 0 .294.605l4.5 1.8a.5.5 0 0 0 .372 0l4.5-1.8a.5.5 0 0 0 .294-.605l-.5-1.7a.5.5 0 0 0-.656-.327L8 10.466 4.176 9.032Z"/>
              </svg>
            </div>
            <p className="text-gray-600 text-sm">Belum ada project yang dimulai</p>
          </div>
        </div>
      </div>
    );
  }

  const progress = calculateRouteProgress(activeRoute?.mulai, activeRoute?.selesai);
  const isCompleted = activeRoute?.selesai;

  return (
    <div className="w-full p-2">
      <h1 className="text-xl font-bold text-gray-800 mb-3">Project sedang berjalan</h1>
      
      <div className="border border-gray-300 rounded-md h-full p-4">
        <div className="flex items-center mb-4 justify-between">
          <div className='flex items-center'>
            <div className={`${isCompleted ? 'bg-green-100' : 'bg-blue-100'} rounded-full p-3 mr-5 flex items-center justify-center`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill={isCompleted ? "#059669" : "#0369a1"}
              className="bi bi-mortarboard-fill"
              viewBox="0 0 16 16"
            >
              <path d="M8.211 2.047a.5.5 0 0 0-.422 0l-7.5 3.5a.5.5 0 0 0 .025.917l7.5 3a.5.5 0 0 0 .372 0L14 7.14V13a1 1 0 0 0-1 1v2h3v-2a1 1 0 0 0-1-1V6.739l.686-.275a.5.5 0 0 0 .025-.917l-7.5-3.5Z"/>
              <path d="M4.176 9.032a.5.5 0 0 0-.656.327l-.5 1.7a.5.5 0 0 0 .294.605l4.5 1.8a.5.5 0 0 0 .372 0l4.5-1.8a.5.5 0 0 0 .294-.605l-.5-1.7a.5.5 0 0 0-.656-.327L8 10.466 4.176 9.032Z"/>
            </svg>
          </div>
          <div>
            <h2 className="text-base font-semibold text-gray-800">
              {activeRoute?.kategori || 'Project Baru'}
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              {isCompleted ? 'Selesai' : 'Sedang Berjalan'}
            </p>
          </div>
          </div>
          <Link 
          to={`/peserta/detail-project/${activeRoute?.id_route}`}
          className={`px-4 py-2 rounded-full font-medium text-sm ${
            isCompleted 
              ? 'bg-green-50 text-green-600 hover:bg-green-100' 
              : 'bg-[#0D5EF4] text-white hover:bg-[#0D42EF]'
          } transition-colors`}>
            Lihat Detail
          </Link>
        </div>

                <div className="mb-6">
          <div className="text-sm font-medium text-gray-800 mb-1">Progress Pengerjaan</div>
          <div className="flex items-center justify-between">
            <div className="w-full bg-gray-300 rounded-full h-5 mr-2">
              <div 
                className={`h-5 rounded-full ${isCompleted ? 'bg-green-600' : 'bg-[#FF9F43]'}`}
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <span className="text-sm text-gray-600 font-medium">{progress}%</span>
          </div>
          {!isCompleted && progress < 100 && (
            <p className="text-xs text-gray-500 mt-1">
              Estimasi berdasarkan waktu yang telah berjalan
            </p>
          )}
        </div>

        <div className="mb-4 flex justify-between items-center">
          <div className="text-sm font-medium text-gray-800">Tanggal Mulai</div>
          <div className="text-sm text-blue-500 font-medium">
            {formatSimpleDate(activeRoute?.mulai)}
          </div>
        </div>

        <div className="mb-4 flex justify-between items-center">
          <div className="text-sm font-medium text-gray-800">Target Selesai</div>
          <div className="text-sm text-blue-500 font-medium">
            {formatSimpleDate(activeRoute?.selesai) || "Belum ditentukan"}
          </div>
        </div>

        <div className="mb-4 flex justify-between items-center">
          <div className="text-sm font-medium text-gray-800">Status</div>
          <div className={`text-sm font-medium px-2 py-1 rounded-full ${
            isCompleted 
              ? 'bg-green-100 text-green-700' 
              : 'bg-blue-100 text-blue-700'
          }`}>
            {isCompleted ? 'Selesai' : 'Aktif'}
          </div>
        </div>



        <div className="flex justify-between items-center mt-3">
          <div className="text-xs text-gray-500">
            Total Project: {allRoutes.length}
          </div>
          
        </div>
      </div>
    </div>
  );
}
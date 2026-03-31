import { Link } from "react-router-dom";
import { useGoogleCallback } from "../../hooks";

function GoogleCallback() {
  const { loading, error } = useGoogleCallback();

  if (error) {
    return (
      <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white rounded-lg p-8 flex flex-col items-center shadow-lg">
          <p className="text-red-500 text-center font-medium">{error}</p>
          <Link
            to="/auth/login"
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Kembali ke Login
          </Link>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white rounded-lg p-8 flex flex-col items-center shadow-lg">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-700 text-center font-medium">Menyambungkan akun Google Anda...</p>
        </div>
      </div>
    )
  }

  return null
}

export default GoogleCallback
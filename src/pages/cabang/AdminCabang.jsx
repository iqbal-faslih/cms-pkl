import { useNavigate } from "react-router-dom";

const AdminCabang = () => {
  const navigate = useNavigate();

  

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Daftar Admin</h1>
        <button
          onClick={() => navigate("/cabang/tambah-admin")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-600 shadow"
        >
          Tambah Admin
        </button>
      </div>
    </div>
  );
};

export default AdminCabang;

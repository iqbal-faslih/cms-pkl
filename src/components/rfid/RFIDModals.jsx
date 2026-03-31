import React from "react";

const RegisterModal = ({ showRegisterModal, setShowRegisterModal, studentName, rfidValue, setRfidValue, handleSave }) => {
  if (!showRegisterModal) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-[999]">
      <div className="bg-pink p-4 rounded-lg w-full max-w-md">
        <div className="bg-white p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-6">Tambahkan RFID Siswa</h2>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Nama Siswa</label>
            <input
              type="text"
              value={studentName}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Gojo satoru"
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 mb-2">RFID Siswa</label>
            <input
              type="text"
              value={rfidValue}
              onChange={(e) => setRfidValue(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="123456789"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              onClick={() => setShowRegisterModal(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700"
            >
              Batal
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-md"
            >
              Simpan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const UpdateModal = ({ showUpdateModal, setShowUpdateModal, studentName, rfidValue, setRfidValue, handleSave }) => {
  if (!showUpdateModal) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-[999]">
      <div className="bg-white p-4 rounded-lg w-full max-w-md">
        <div className="bg-white p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-6">Ganti RFID Siswa</h2>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Nama Siswa</label>
            <input
              type="text"
              value={studentName}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Gojo satoru"
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 mb-2">RFID Siswa</label>
            <input
              type="text"
              value={rfidValue}
              onChange={(e) => setRfidValue(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="123456789"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              onClick={() => setShowUpdateModal(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700"
            >
              Batal
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-md"
            >
              Simpan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export { RegisterModal, UpdateModal };

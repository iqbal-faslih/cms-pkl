import { useState } from "react";
import WrapperAddPiket from "../wrapper/WrapperAddPiket";
import MultiSelect from "../input/MultiselectField";

export default function ModalTambahPiket({ show, setShow }) {
  const [shift, setShift] = useState("pagi");
  const [hari, setHari] = useState("");
  const [siswaDipilih, setSiswaDipilih] = useState([]);

  const hariOptions = [
    "Senin",
    "Selasa",
    "Rabu",
    "Kamis",
    "Jumat",
  ];

  const siswaOptions = [
    { id: 1, name: "Gojo Satoru" },
    { id: 2, name: "Ron Kamonohashi" },
    { id: 3, name: "Harry Vaughan" },
    { id: 4, name: "Cha Eun-woo" },
  ];

  const handleClose = () => {
    setShift("pagi");
    setHari("");
    setSiswaDipilih([]);
    setShow(false);
  };

  const handleSubmit = () => {
    const payload = {
      shift,
      hari,
      siswa: siswaDipilih.map((s) => s.id),
    };

    console.log("Payload Piket:", payload);
    handleClose();
  };

  return (
    <WrapperAddPiket show={show} onClose={handleClose}>
      {/* SHIFT */}
      <label className="text-md font-semibold text-gray-800">
        Shift
      </label>
      <div className="flex gap-3 mt-2">
        <button
          type="button"
          onClick={() => setShift("pagi")}
          className={`px-6 py-2 rounded-xl border ${
            shift === "pagi"
              ? "bg-blue-500 text-white"
              : "border-blue-500 text-blue-500"
          }`}
        >
          Pagi
        </button>

        <button
          type="button"
          onClick={() => setShift("sore")}
          className={`px-6 py-2 rounded-xl border ${
            shift === "sore"
              ? "bg-blue-500 text-white"
              : "border-blue-500 text-blue-500"
          }`}
        >
          Sore
        </button>
      </div>

      {/* HARI */}
      <div className="mt-4">
        <label className="text-md font-semibold text-gray-800">
          Hari
        </label>
        <select
          value={hari}
          onChange={(e) => setHari(e.target.value)}
          className="w-full mt-2 px-4 py-3 rounded-xl border border-gray-300"
        >
          <option value="">Pilih hari</option>
          {hariOptions.map((h) => (
            <option key={h} value={h}>
              {h}
            </option>
          ))}
        </select>
      </div>

      {/* NAMA SISWA */}
      <div className="mt-4">
        <MultiSelect
          label="Nama Siswa"
          placeholder="Pilih nama siswa"
          selectedItems={siswaDipilih}
          onSelectionChange={setSiswaDipilih}
          options={siswaOptions}
        />
      </div>

      {/* FOOTER */}
      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={handleClose}
          className="px-6 py-2 border rounded-xl text-gray-600"
        >
          Batal
        </button>
        <button
          onClick={handleSubmit}
          className="px-6 py-2 bg-blue-500 text-white rounded-xl"
        >
          Simpan
        </button>
      </div>
    </WrapperAddPiket>
  );
}

import { Icon } from "@iconify/react";
import InputField from "../../../shared/components/input/InputField";
import { IoAlertCircleOutline } from "react-icons/io5";

export const presentasiFields = {
  tambahJadwal: {
    fields: [
      {
        name: "judul",
        label: "Judul Presentasi",
        required: true,
        placeholder: "Judul Presentasi",
      },
      {
        name: "lokasi_presentasi",
        label: "Lokasi Presentasi",
        required: true,
        hidden: true,
      },
      {
        name: "link_zoom",
        label: "Link Zoom",
        required: true,
        hidden: true,
      },

      {
        name: "kuota",
        label: "Kuota",
        required: true,
        placeholder: "Masukkan Kuota",
      },
      {
        name: "metode",
        label: "Metode Presentasi",
        type: "select",
        options: [
          { value: "offline", label: "Offline" },
          { value: "online", label: "Online" },
        ],
        required: true,
        placeholder: "Pilih Metode Presentasi",
      },
      {
        name: "dynamic_metode_field",
        type: "custom",
        render: (form, setForm, error, errors) => {
          const offlineError =
            form.metode === "offline" ? errors.lokasi_presentasi : null;
          const onlineError =
            form.metode === "online" ? errors.link_zoom : null;

          const finalError = offlineError || onlineError;

          if (form.metode === "offline") {
            return (
              <InputField
                label="Lokasi Presentasi"
                name="lokasi_presentasi"
                placeholder="Masukkan lokasi presentasi"
                error={finalError}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    lokasi_presentasi: e.target.value,
                  }))
                }
              />
            );
          }

          if (form.metode === "online") {
            return (
              <InputField
                label="Link Zoom"
                name="link_zoom"
                placeholder="Masukkan link Zoom"
                error={finalError}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, link_zoom: e.target.value }))
                }
              />
            );
          }

          return null;
        },
      },

      {
        name: "jam_presentasi",
        type: "custom",
        label: "Jam Presentasi",
        required: true,
        render: (form, setForm, error) => {
          const onChange = (field, val) => {
            const mulai = field === "mulai" ? val : form.jam_mulai;
            const selesai = field === "selesai" ? val : form.jam_selesai;

            setForm((prev) => ({
              ...prev,
              jam_mulai: mulai,
              jam_selesai: selesai,

              jam_presentasi: mulai && selesai ? `${mulai}-${selesai}` : "",
            }));
          };
          return (
            <div className="w-full mb-4">
              <label className="block font-medium mb-1">
                Jam Presentasi<span className="text-red-500 ml-1">*</span>
              </label>

              <div className="flex items-center gap-2">
                <div className="flex items-center w-full">
                  <input
                    type="time"
                    value={form.jam_mulai || ""}
                    onChange={(e) => onChange("mulai", e.target.value)}
                    className={`border-l border-y border-gray-300 rounded-l-lg px-2 h-10 w-full text-gray-700 ${
                      error ? "border-red-500" : ""
                    }`}
                  />
                  <div
                    className={`px-3 h-10 flex items-center rounded-r-lg border-r border-y border-gray-300 ${
                      error ? "border-red-500" : ""
                    }`}
                  >
                    <Icon
                      icon={"mdi:clock-outline"}
                      width={24}
                      height={24}
                      className="text-gray-400 "
                    />
                  </div>
                </div>

                <span className="text-slate-600">-</span>

                <div className="flex items-center w-full">
                  <input
                    type="time"
                    value={form.jam_selesai || ""}
                    onChange={(e) => onChange("selesai", e.target.value)}
                    className={`border-l border-y border-gray-300 rounded-l-lg px-2 h-10 w-full text-gray-700 ${
                      error ? "border-red-500" : ""
                    }`}
                  />

                  <div
                    className={`px-3 h-10 flex items-center rounded-r-lg border-r border-y border-gray-300 ${
                      error ? "border-red-500" : ""
                    }`}
                  >
                    <Icon
                      icon={"mdi:clock-outline"}
                      width={24}
                      height={24}
                      className="text-gray-400 "
                    />
                  </div>
                </div>
              </div>
              {error && (
                <div className="mt-1 flex items-center text-red-500 text-sm gap-1">
                  <IoAlertCircleOutline size={15} /> {error}
                </div>
              )}
            </div>
          );
        },
      },
      {
        name: "tanggal_mulai",
        label: "Tanggal Mulai",
        type: "calendar",
        required: true,
        placeholder: "Masukkan Tanggal Mulai",
      },
      {
        name: "tanggal_selesai",
        label: "Tanggal Selesai",
        type: "calendar",
        required: true,
        placeholder: "Masukkan Tanggal Selesai",
      },
    ],
    layouts: [
      ["judul"],
      ["kuota", "metode"],
      ["jam_presentasi", "dynamic_metode_field"],
      ["tanggal_mulai", "tanggal_selesai"],
    ],
  },
};

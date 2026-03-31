export const journalDetailFields = [
  {
    name: "judul",
    type: "custom",
    fullWidth: true,
    render: (form) => (
      <div className="w-full">
        <h1 className="text-xl font-semibold">{form.judul}</h1>
      </div>
    ),
  },
  {
    name: "name",
    type: "custom",
    fullWidth: true,
    render: (form) => (
      <div className="w-full">
        <h1 className="text-2xl font-semibold">{form.name}</h1>
      </div>
    ),
  },
  {
    name: "date",
    // label: "Tanggal",
    type: "text",
    readonly: true,
  },
  {
    name: "judul",
    // label: "Judul",
    type: "text",
    rows: 1,
    readonly: true,
    fullWidth: false,
  },
  {
    name: "school",
    // label: "Judul",
    type: "text",
    rows: 1,
    readonly: true,
    fullWidth: false,
  },
  {
    name: "description",
    label: "Kegiatan",
    type: "textarea",
    rows: 5,
    readonly: true,
    fullWidth: true,
  },
  {
    name: "bukti",
    type: "custom",
    fullWidth: false,
    render: (form) => (
      <div className="w-full h-60 border border-gray-200 rounded-md my-3">
        {form.bukti ? (
          <img
            src={form.bukti}
            className="rounded-lg w-full h-full object-cover"
          />
        ) : (
          <p className="text-sm text-gray-500">Belum ada bukti</p>
        )}
      </div>
    ),
  },
];

import InputField from "../../../shared/components/input/InputField";

export const divisionFields = (divisions = [], mentors = []) => [
  {
    type: "select",
    label: "Divisi",
    name: "division",
    required: true,
    options: divisions.map((d) => ({ label: d.name, value: d.id })), 
  },
  {
    type: "select",
    label: "Mentor",
    name: "mentor",
    required: true,
    options: mentors.map((m) => ({ label: m.name, value: m.id })), 
  },
  {
    type: "textarea",
    label: "Description",
    name: "description",
    placeholder:
      "You were moved to a new division by your mentor to better match your skills and support the team’s needs.",
    required: true,
    rows: 4,
  },
];

export const journalDetailFields = [
  { 
    name: "tgl", 
    label: "Tanggal", 
    type: "text",
    readonly: true,
  },
  { 
    name: "desc", 
    label: "Deskripsi", 
    type: "textarea", 
    rows: 5,
    readonly: true,
    fullWidth: true,
  },
  {
    name: "test",
    type: "custom",
    fullWidth: false,
    render: (form) => (
      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-2">
          <InputField
            label="Tanggal"
            name="tgl"
            type="text"
            value={form.tgl}
            readonly
          />
          <InputField
            label="Judul"
            name="judul"
            type="text"
            value={form.judul}
            readonly
          />
        </div>
        <div className="space-y-1">
          <h2 className="text-gray-700 font-semibold">Bukti</h2>
          {form.bukti ? (
            <img src={form.bukti} className="rounded-lg w-full h-32 object-cover" />
          ) : (
            <p className="text-sm text-gray-500">Belum ada bukti</p>
          )}
        </div>
      </div>
      ),
  },
];

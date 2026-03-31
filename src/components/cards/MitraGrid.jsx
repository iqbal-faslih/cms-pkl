import MitraCard from "./MitraCard";

const MitraGrid = ({ filtered, baseUrl, onDelete, onEdit, onView }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
      {filtered.length > 0 ? (
        filtered.map((university) => (
          <MitraCard
            key={university.id}
            university={university}
            baseUrl={baseUrl}
            onDelete={onDelete}
            onEdit={onEdit}
            onView={onView}
          />
        ))
      ) : (
        <div className="col-span-full text-center py-8 text-gray-500">
          Tidak ada mitra yang ditemukan untuk kategori ini
        </div>
      )}
    </div>
  );
};

export default MitraGrid;
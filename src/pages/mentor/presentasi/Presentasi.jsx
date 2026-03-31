import React, { useState } from "react";
import Card from "../../../components/cards/Card";
import TableHeader from "../../../shared/components/table/TableHeader";
import { presentasiConfig } from "./config";
import { transformPresentationData } from "../../../helpers/presentationHelper";
import { dummyPresentations } from "./dummy";
import PresentationCard from "./PresentationCard";
import FormModal from "../../../shared/components/modal/FormModal";
import { presentasiFields } from "./fields";

const Presentasi = () => {
  const [isTambahOpen, setIsTambahOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);


  const modalHanlders = {
    openTambah: () => setIsTambahOpen(true),
    openDetail: () => setIsDetailOpen(true)
  };

  const presentations = transformPresentationData(dummyPresentations, false);
  const config = presentasiConfig({
    openAdd: modalHanlders.openTambah,
  });

  return (
    <Card className="rounded-2xl p-4">
      <TableHeader config={config.headerConfig} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
        {presentations.map((item) => (
          <PresentationCard
            key={item.id}
            item={item}
            buttonLabel={"Detail"}
            buttonVariant="outline"
            onButtonClick={modalHanlders.openDetail}
          />
        ))}
      </div>

      <FormModal
        open={isTambahOpen}
        title="Tambah Jadwal Presentasi"
        showIcon={false}
        showClose={false}
        actions={[
          {
            label: "Batal",
            className:
              "px-6 py-2 rounded-md border border-gray-200 font-semibold text-gray-700 hover:bg-gray-100 w-full",
            onClick: () => setIsTambahOpen(false),
          },
          {
            label: "Simpan",
            type: "submit",
            className:
              " px-6 py-2 rounded-md font-semibold text-white transition-colors bg-blue-600 hover:bg-blue-700 w-full",
          },
        ]}
        fields={presentasiFields.tambahJadwal.fields}
        layout
        
        ={presentasiFields.tambahJadwal.layouts}
      />

      <FormModal
        open={isDetailOpen}
        title="Tambah Jadwal Presentasi"
        showIcon={false}
        showClose={false}
        actions={[
          {
            label: "Batal",
            className:
              "px-6 py-2 rounded-md border border-gray-200 font-semibold text-gray-700 hover:bg-gray-100 w-full",
            onClick: () => setIsDetailOpen(false),
          },
          {
            label: "Simpan",
            type: "submit",
            className:
              " px-6 py-2 rounded-md font-semibold text-white transition-colors bg-blue-600 hover:bg-blue-700 w-full",
          },
        ]}
        fields={presentasiFields.tambahJadwal.fields}
        layout
        
        ={presentasiFields.tambahJadwal.layouts}
      />
    </Card>
  );
};

export default Presentasi;

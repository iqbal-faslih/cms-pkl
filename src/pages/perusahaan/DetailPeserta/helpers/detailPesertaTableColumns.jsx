import React from "react";
import Button from "@/shared/components/button/Button";
import { Icon } from "@iconify/react";

export const buildDetailPesertaTableColumns = ({
  columns,
  onDetailClick,
  onImageClick,
}) =>
  columns.map((col) => {
    if (col.key === "actions") {
      return {
        ...col,
        textAlign: "text-center",
        cellClassName: "text-center",
        render: (_, row) => (
          <div className="flex items-center justify-center gap-2">
            <Button
              onClick={() => onDetailClick(row)}
              className="bg-[#0D5EF4] hover:bg-[#0D42EF] cursor-pointer py-2 px-2 text-white rounded-md text-sm transition duration-300 ease-in-out"
            >
              Lihat Detail
            </Button>
          </div>
        ),
      };
    }

    if (col.key === "bukti" || col.key === "gambar") {
      return {
        ...col,
        render: (_, row) => (
          <div className="flex items-center justify-center mx-auto">
            <Button
              onClick={() => onImageClick(row.bukti)}
              className="bg-[#0D5EF4] hover:bg-[#0D42EF] cursor-pointer py-2 px-2 text-white rounded-md text-sm transition duration-300 ease-in-out"
            >
              <Icon icon="streamline-plump:landscape-view" width="20" height="20" />
            </Button>
          </div>
        ),
        cellClassName: "text-center",
      };
    }

    return col;
  });

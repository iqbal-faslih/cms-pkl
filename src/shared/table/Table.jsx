import React from "react";
import Pagination from "../components/Pagination";

const DataTable = ({ config = {}, emptyMessage, data = [], pagination }) => {
  const {
    columns = [],
    tableStyle = "default",
    className = "",
    customRender,

    headerStyle = {}, // untuk <th>
    cellStyle = {}, // untuk <td>
    theadClassName = "",
    tbodyClassName = "",
  } = config;

  const baseTableClass =
    tableStyle === "default" ? "border-separate border-spacing-0" : "";

  return (
    <div className="overflow-x-auto">
      <table className={`min-w-max ${baseTableClass} ${className}`}>
        <thead
          className={`
            ${theadClassName}
            ${headerStyle.bgColor || ""}
            ${headerStyle.textColor || ""}
          `}
        >
          <tr>
            {columns.map((col, index) => (
              <th
                key={index}
                // atur style header nya di config
                className={`
                    ${headerStyle.px || ""}
                    ${headerStyle.py || ""}
                    ${headerStyle.fontWeight || ""}
                    ${headerStyle.textAlign || ""}
                    ${headerStyle.textColor || ""}
                    ${headerStyle.bgColor || ""}
                    ${headerStyle.borderTop || ""}
                    ${headerStyle.borderBottom || ""}
                    ${col.headerClassName || ""}
                  `}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={tbodyClassName}>
          {data?.length > 0 ? (
            data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={`
                  ${cellStyle.rowHover || ""}
                  ${cellStyle.rowTransition || ""}
                `}
                style={cellStyle.rowStyle || {}}
              >
                {columns.map((col, colIndex) => {
                  const value = row[col.key];

                  // atur style cell nya di config
                  const tdClass = `
                    ${cellStyle.px || ""}
                    ${cellStyle.py || ""}
                    ${cellStyle.textAlign || ""}
                    ${cellStyle.fontWeight || ""}
                    ${cellStyle.textColor || ""}
                    ${cellStyle.borderBottom || ""}
                    ${cellStyle.borderTop || ""}
                    ${cellStyle.borderLeft || ""}
                    ${cellStyle.borderRight || ""}
                    ${col.cellClassName || ""}
                  `;

                  const content = col.render
                    ? col.render(value, row, rowIndex)
                    : customRender
                    ? customRender(value, col, row, rowIndex)
                    : value;

                  return (
                    <td
                      key={colIndex}
                      className={tdClass}
                      style={col.cellStyle || {}}
                    >
                      {content}
                    </td>
                  );
                })}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className={`text-center ${cellStyle.py || "py-6"} ${
                  cellStyle.textColor || "text-gray-500"
                }`}
              >
                {emptyMessage || "Tidak ada data"}
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      {pagination && data.length !== 0 && (
        <div className="px-10 py-4 mt-4">
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            itemsPerPage={pagination.itemsPerPage}
            totalItems={pagination.totalItems}
            onPageChange={pagination.onPageChange}
            label={pagination.label || "data"}
          />
        </div>
      )}
    </div>
  );
};

export default DataTable;

import React from "react";

const FormField = ({ label, value }) => (
  <div className="flex flex-col gap-1">
    <label className="text-md text-black">{label}</label>
    <div className="w-full border border-gray-300 rounded-lg px-3 py-2 text-md text-gray-500 bg-white">
      {value || "-"}
    </div>
  </div>
);

export default FormField;

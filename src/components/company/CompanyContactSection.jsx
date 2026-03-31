import React from "react";

export const CompanyContactSection = ({ formData, handleChange }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {[
        { label: "Email Perusahaan", name: "email" },
        { label: "Telepon Perusahaan", name: "telepon" },
        { label: "Website Perusahaan", name: "website" },
      ].map((field) => (
        <div key={field.name} className="w-full">
          <label className="block text-sm font-medium text-black mb-1">
            {field.label}
          </label>
          <input
            type="text"
            name={field.name}
            value={formData[field.name]}
            onChange={handleChange}
            placeholder={field.label}
            className="w-full p-2 border border-[#D5DBE7] rounded placeholder-[#667797] focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      ))}
    </div>
  );
};

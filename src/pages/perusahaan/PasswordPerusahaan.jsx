import React from "react";

export default function PasswordPerusahaan() {
  return (
    <div className="w-full bg-[#F9FAFB] min-h-screen pb-16">
      <div className="bg-white shadow-sm rounded-xl p-6 mx-auto max-w-[600px] mt-6">
        <h2 className="text-[20px] font-semibold text-slate-900 mb-2">Password Settings</h2>

        {/* Requirements */}
        <ul className="text-sm text-slate-600 mb-8 space-y-1">
          <li>• At least one lowercase character</li>
          <li>• Minimum 8 characters long, the more the better</li>
          <li>• At least one number, symbol, or whitespace character</li>
        </ul>

        {/* Form */}
        <div className="flex flex-col gap-6">
          <div>
            <label className="text-sm text-slate-700">Current Password</label>
            <input
              type="password"
              className="mt-1 w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
              placeholder="Enter Current Password"
            />
            <span className="text-sm text-blue-600 cursor-pointer mt-1 inline-block">Lupa Kata Sandi?</span>
          </div>

          <div>
            <label className="text-sm text-slate-700">New Password</label>
            <input
              type="password"
              className="mt-1 w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
              placeholder="Enter New Password"
            />
          </div>

          <div>
            <label className="text-sm text-slate-700">Confirm Password</label>
            <input
              type="password"
              className="mt-1 w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
              placeholder="Enter Confirm Password"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-12">
          <button className="px-6 py-2 border border-slate-300 rounded-xl">Batal</button>
          <button className="px-6 py-2 bg-blue-600 text-white rounded-xl">Simpan</button>
        </div>
      </div>
    </div>
  );
}

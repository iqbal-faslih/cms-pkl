import React, { useState } from "react";
import Search from "../../../shared/components/Search.jsx";
import { HiOutlinePencilAlt } from "react-icons/hi";
import { FiSunset, FiSunrise } from "react-icons/fi";
import { FaArrowLeft } from "react-icons/fa6";

export default function PiketCabang() {
  const [activeShift, setActiveShift] = useState("pagi");

  const days = [
    {
      title: "Senin",
      borderColor: "border-[#84aefa]",
      bgColor: "bg-[#ebf0ff]",
      textColor: "text-[#3e7ff7]",
      itemBg: "bg-[#c9dbff]",
    },
    {
      title: "Selasa",
      borderColor: "border-[#e84647]",
      bgColor: "bg-[#fceded]",
      textColor: "text-[#eb5454]",
      itemBg: "bg-[#facfcf]",
    },
    {
      title: "Rabu",
      borderColor: "border-[#039c3b]",
      bgColor: "bg-[#e6f5eb]",
      textColor: "text-[#0d9e42]",
      itemBg: "bg-[#bee6cd]",
    },
    {
      title: "Kamis",
      borderColor: "border-[#193cff]",
      bgColor: "bg-[#ebeeff]",
      textColor: "text-[#2b4bff]",
      itemBg: "bg-[#c5cdff]",
    },
    {
      title: "Jumat",
      borderColor: "border-[#ff9f40]",
      bgColor: "bg-[#fff5ed]",
      textColor: "text-[#ff9f45]",
      itemBg: "bg-[#ffe3c9]",
    },
  ];

  const persons = Array(5).fill("Ahmad Giovani");

  return (
    <div className="min-h-screen bg-white p-4 md:p-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between mb-4 md:mb-6 gap-4">
        <div className="flex items-center gap-3">
          <FaArrowLeft
            className="text-gray-600 cursor-pointer hover:text-gray-800"
            size={20}
          />

          <div>
            <h1 className="text-lg font-semibold">Jadwal Piket Harian</h1>
            <p className="text-sm text-emerald-500">
              Informasi Detail Data Sesi 1
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="order-2 sm:order-1">
            <Search
            />
          </div>
          
          <div className="order-1 sm:order-2 flex items-center gap-2">
            <button
              onClick={() => setActiveShift("pagi")}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-colors ${
                activeShift === "pagi"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              <FiSunrise size={18} />
              Pagi
            </button>

            <button
              onClick={() => setActiveShift("sore")}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-colors ${
                activeShift === "sore"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              <FiSunset size={18} />
              Sore
            </button>

            <button className="px-4 py-2 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors whitespace-nowrap">
              Buat Jadwal
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-wrap justify-center gap-3 md:gap-4 py-4 md:py-6">
        {days.map((day, index) => (
          <div
            key={index}
            className={`w-[300px] border rounded-xl p-3 md:p-4 shadow-sm ${day.borderColor} ${day.bgColor} ${day.textColor}`}
          >
            <div className="flex justify-between items-center mb-3 md:mb-4">
              <h2 className="text-lg md:text-xl font-semibold">{day.title}</h2>
              <HiOutlinePencilAlt
                size={20}
                className="opacity-70 cursor-pointer hover:opacity-100"
              />
            </div>

            <div className="flex flex-col gap-2 md:gap-3">
              {persons.map((person, idx) => (
                <div
                  key={idx}
                  className={`w-full py-1.5 md:py-2 text-center rounded-md ${day.itemBg} font-semibold text-sm md:text-base`}
                >
                  {person}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
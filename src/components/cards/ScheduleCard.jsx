import { ArrowLeft } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ScheduleCard() {
  const navigate = useNavigate();

  const [scheduleData, setScheduleData] = useState({
    senin: { active: false },
    selasa: { active: false },
    rabu: { active: false },
    kamis: { active: false },
    jumat: { active: false },
    sabtu: { active: false },
    minggu: { active: false },
  });

  const defaultTimes = {
    sesi1: "07:00",
    pulang1: "13:00",
    sesi2: "12:00",
    pulang2: "17:00",
  };

  const defaultSessions = {
    sesi1: "Sesi 1",
    pulang1: "Pulang Sesi 1",
    sesi2: "Sesi 2",
    pulang2: "Pulang Sesi 2",
  };

  const [times, setTimes] = useState({
    senin: { ...defaultTimes },
    selasa: { ...defaultTimes },
    rabu: { ...defaultTimes },
    kamis: { ...defaultTimes },
    jumat: { ...defaultTimes },
    sabtu: { ...defaultTimes },
    minggu: { ...defaultTimes },
  });

  const [sessions, setSessions] = useState({
    senin: { ...defaultSessions },
    selasa: { ...defaultSessions },
    rabu: { ...defaultSessions },
    kamis: { ...defaultSessions },
    jumat: { ...defaultSessions },
    sabtu: { ...defaultSessions },
    minggu: { ...defaultSessions },
  });

  const toggleDay = (day) => {
    setScheduleData((prev) => ({
      ...prev,
      [day]: { active: !prev[day].active },
    }));
  };

  const isWeekend = (day) => day === "sabtu" || day === "minggu";

  const updateTime = (day, field, value) => {
    setTimes((prev) => ({
      ...prev,
      [day]: { ...prev[day], [field]: value },
    }));
  };

  const updateSession = (day, field, value) => {
    setSessions((prev) => ({
      ...prev,
      [day]: { ...prev[day], [field]: value },
    }));
  };

  const renderTimeSelect = (day, field) => {
    const isActive = scheduleData[day].active;

    return (
      <select
        className={`w-full border border-gray-300 rounded-lg bg-white text-sm px-3 py-2 ${
          !isActive ? "opacity-50 cursor-not-allowed" : ""
        }`}
        value={times[day][field]}
        disabled={!isActive}
        onChange={(e) => updateTime(day, field, e.target.value)}
      >
        {[...Array(16)]
          .map((_, i) => {
            const hour = 7 + i;
            return ["00", "15", "30", "45"].map((m) => {
              const t = `${hour.toString().padStart(2, "0")}:${m}`;
              return (
                <option key={t} value={t}>
                  {t}
                </option>
              );
            });
          })
          .flat()}
      </select>
    );
  };

  const renderSessionSelect = (day, field) => {
    const isActive = scheduleData[day].active;
    const options = field.includes("pulang")
      ? ["Pulang Sesi 1", "Pulang Sesi 2", "Pulang Sesi 3", "Pulang Sesi 4"]
      : ["Sesi 1", "Sesi 2", "Sesi 3", "Sesi 4"];

    return (
      <select
        className={`w-full border border-gray-300 rounded-lg bg-white text-sm px-3 py-2 ${
          !isActive ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={!isActive}
        value={sessions[day][field]}
        onChange={(e) => updateSession(day, field, e.target.value)}
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    );
  };

  const dayNames = {
    senin: "Senin",
    selasa: "Selasa",
    rabu: "Rabu",
    kamis: "Kamis",
    jumat: "Jumat",
    sabtu: "Sabtu",
    minggu: "Minggu",
  };

  const DayCard = ({ day }) => {
    const isActive = scheduleData[day].active;

    return (
      <div className="bg-white rounded-3xl shadow-sm/50 w-full relative p-4">
        <div className="p-3 flex items-center justify-between">
          <h3 className="text-3xl font-bold">{dayNames[day]}</h3>

          <div
            className={`w-17 h-8 rounded-full flex items-center justify-between px-0.5 cursor-pointer transition-all duration-300 ease-out bg-white
            ${
              isWeekend(day)
                ? isActive
                  ? "border border-red-500 hover:ring-2 hover:ring-red-300"
                  : "border border-gray-300 hover:ring-2 hover:ring-red-300"
                : isActive
                ? "border border-blue-500 hover:ring-2 hover:ring-blue-300"
                : "border border-gray-300 hover:ring-2 hover:ring-blue-300"
            }
            hover:ring-opacity-60 hover:shadow-[0_0_6px_rgba(0,0,0,0.1)]
          `}
            onClick={() => toggleDay(day)}
          >
            <div
              className={`w-[26px] h-[26px] rounded-full transition-all duration-300 ease-out hover:scale-110 hover:brightness-80
                ${
                  isWeekend(day)
                    ? isActive
                      ? "bg-red-500 translate-x-9"
                      : "bg-gray-300 translate-x-0"
                    : isActive
                    ? "bg-blue-500 translate-x-9"
                    : "bg-gray-300 translate-x-0"
                }
              `}
            ></div>
          </div>
        </div>

        <div
          className={`p-4 grid grid-cols-2 gap-2 ${
            !isActive ? "opacity-50" : ""
          }`}
        >
          <div>{renderSessionSelect(day, "sesi1")}</div>
          <div>{renderTimeSelect(day, "sesi1")}</div>

          <div>{renderSessionSelect(day, "pulang1")}</div>
          <div>{renderTimeSelect(day, "pulang1")}</div>

          <div>{renderSessionSelect(day, "sesi2")}</div>
          <div>{renderTimeSelect(day, "sesi2")}</div>

          <div>{renderSessionSelect(day, "pulang2")}</div>
          <div>{renderTimeSelect(day, "pulang2")}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="px-4">
      <div
        className="flex items-center mb-6 cursor-pointer w-max pl-5"
        onClick={() => navigate(-1)}
      >
        <div className="w-8 h-8 rounded-full text-black hover:text-gray-500 hover:scale-125 duration-200 hover:duration-200 flex items-center justify-center mr-1">
          <ArrowLeft />
        </div>
        <span className="text-lg font-medium">Jam Kantor</span>
      </div>

      <div className="flex flex-wrap justify-center gap-4 px-2">
        {Object.keys(scheduleData).map((day) => (
          <div key={day} className="w-full md:w-[48%] lg:w-[31%] flex justify-center">
            <DayCard day={day} />
          </div>
        ))}
      </div>
    </div>
  );
}

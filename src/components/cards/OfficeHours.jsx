import React, { useMemo, useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const DAYS = [
  { key: "mon", label: "Senin", defaultEnabled: true },
  { key: "tue", label: "Selasa", defaultEnabled: true },
  { key: "wed", label: "Rabu", defaultEnabled: true },
  { key: "thu", label: "Kamis", defaultEnabled: true },
  { key: "fri", label: "Jumat", defaultEnabled: true },
  { key: "sat", label: "Sabtu", defaultEnabled: true },
  { key: "sun", label: "Minggu", defaultEnabled: false },
];

const SESSION_OPTIONS = [
  { value: "in1", label: "Sesi 1" },
  { value: "out1", label: "Pulang Sesi 1" },
  { value: "in2", label: "Sesi 2" },
  { value: "out2", label: "Pulang Sesi 2" },
];

const defaultRows = () => [
  { sessionKey: "in1", time: "07.00" },
  { sessionKey: "out1", time: "13.00" },
  { sessionKey: "in2", time: "12.00" },
  { sessionKey: "out2", time: "17.00" },
];

const makeDayState = (enabled) => ({ enabled, rows: defaultRows() });

const pad2 = (n) => String(n).padStart(2, "0");
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

function useOutsideClick(ref, handler) {
  useEffect(() => {
    const onDown = (e) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target)) handler?.();
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [ref, handler]);
}

function ChevronDown({ className = "" }) {
  return (
    <svg
      className={className}
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M7 10l5 5 5-5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SessionDropdown({ value, onChange, options, disabled }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  useOutsideClick(wrapRef, () => setOpen(false));

  const selected = options.find((o) => o.value === value)?.label ?? "-";

  return (
    <div ref={wrapRef} className="relative w-[58%]">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((s) => !s)}
        className={[
          "flex h-7 w-full items-center justify-between rounded-md border bg-white px-2.5",
          "text-[11px] text-gray-600",
          "focus:outline-none focus:ring-2 focus:ring-sky-200",
          disabled ? "cursor-not-allowed opacity-70" : "hover:border-gray-400",
          open ? "border-sky-300" : "border-gray-300",
        ].join(" ")}
      >
        <span className="truncate">{selected}</span>
        <ChevronDown className={open ? "text-gray-700" : "text-gray-500"} />
      </button>

      {open && !disabled && (
        <div className="absolute z-30 mt-2 w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
          <div className="py-1">
            {options.map((opt) => {
              const active = opt.value === value;
              return (
                <button
                  type="button"
                  key={opt.value}
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className={[
                    "w-full px-3 py-1.5 text-left text-[11px]",
                    active ? "bg-sky-50 text-gray-900" : "text-gray-700 hover:bg-gray-50",
                  ].join(" ")}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function TimeDropdown({
  value,
  onChange,
  disabled,
  hourMin = 0,
  hourMax = 23,
  minuteStep = 1,
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  useOutsideClick(wrapRef, () => setOpen(false));

  const [hh, mm] = (value || "00.00").split(".");
  const hour = clamp(parseInt(hh || "0", 10), hourMin, hourMax);
  const minute = clamp(parseInt(mm || "0", 10), 0, 59);

  const hours = useMemo(() => {
    const arr = [];
    for (let h = hourMin; h <= hourMax; h++) arr.push(h);
    return arr;
  }, [hourMin, hourMax]);

  const minutes = useMemo(() => {
    const arr = [];
    for (let m = 0; m < 60; m += minuteStep) arr.push(m);
    return arr;
  }, [minuteStep]);

  const setHour = (h) => onChange(`${pad2(h)}.${pad2(minute)}`);
  const setMinute = (m) => onChange(`${pad2(hour)}.${pad2(m)}`);

  return (
    <div ref={wrapRef} className="relative w-[42%]">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((s) => !s)}
        className={[
          "flex h-7 w-full items-center justify-between rounded-md border bg-white px-2.5",
          "text-[11px] text-gray-600",
          "focus:outline-none focus:ring-2 focus:ring-sky-200",
          disabled ? "cursor-not-allowed opacity-70" : "hover:border-gray-400",
          open ? "border-sky-300" : "border-gray-300",
        ].join(" ")}
      >
        <span className="tabular-nums">
          {pad2(hour)}.{pad2(minute)}
        </span>
        <ChevronDown className={open ? "text-gray-700" : "text-gray-500"} />
      </button>

      {open && !disabled && (
        <div className="absolute z-30 mt-2 w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
          <div className="grid grid-cols-2 gap-0 px-2 py-2">
            <div className="border-r border-gray-100 pr-1">
              <div className="h-40 overflow-y-auto pr-1">
                {hours.map((h) => {
                  const active = h === hour;
                  return (
                    <button
                      type="button"
                      key={h}
                      onClick={() => setHour(h)}
                      className={[
                        "w-full rounded-md px-2 py-1.5 text-left text-[11px] tabular-nums",
                        active ? "bg-sky-50 text-gray-900" : "text-gray-700 hover:bg-gray-50",
                      ].join(" ")}
                    >
                      {pad2(h)}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pl-1">
              <div className="h-40 overflow-y-auto pr-1">
                {minutes.map((m) => {
                  const active = m === minute;
                  return (
                    <button
                      type="button"
                      key={m}
                      onClick={() => setMinute(m)}
                      className={[
                        "w-full rounded-md px-2 py-1.5 text-left text-[11px] tabular-nums",
                        active ? "bg-sky-50 text-gray-900" : "text-gray-700 hover:bg-gray-50",
                      ].join(" ")}
                    >
                      {pad2(m)}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function OfficeHours() {
  const navigate = useNavigate();

  const initial = useMemo(() => {
    const obj = {};
    for (const d of DAYS) obj[d.key] = makeDayState(d.defaultEnabled);
    return obj;
  }, []);

  const [hours, setHours] = useState(initial);

  const toggleDay = (dayKey) => {
    setHours((prev) => ({
      ...prev,
      [dayKey]: { ...prev[dayKey], enabled: !prev[dayKey].enabled },
    }));
  };

  const setRowField = (dayKey, rowIndex, field, value) => {
    setHours((prev) => {
      const day = prev[dayKey];
      const rows = day.rows.map((r, i) => (i === rowIndex ? { ...r, [field]: value } : r));
      return { ...prev, [dayKey]: { ...day, rows } };
    });
  };

  return (
    <div className="w-full">
      <div className="rounded-2xl border border-[#CFD5E4] bg-[#EEF2FA]">
        <div className="px-6 pt-5">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-gray-900"
          >
            <span className="text-base leading-none">←</span>
            <span>Jam Kantor</span>
          </button>
        </div>

        <div className="px-4 pb-8 pt-4 md:px-6">
          <div className="mx-auto max-w-[1060px] rounded-2xl border border-[#D7DBE5] bg-[#F7F8FA] p-3 md:p-4">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              {DAYS.map((d) => {
                const day = hours[d.key];
                const isOff = !day.enabled;
                const sundayCenter = d.key === "sun" ? "md:col-start-2" : "";

                return (
                  <div
                    key={d.key}
                    className={[
                      sundayCenter,
                      "w-full rounded-2xl border border-[#CFCFD4] bg-[#F7F7F7] px-4 py-3",
                    ].join(" ")}
                  >
                    <div className="mb-3 flex items-start justify-between">
                      <h3 className="text-[36px] font-extrabold leading-none text-[#1D1D1F]">
                        {d.label}
                      </h3>

                      <button
                        type="button"
                        onClick={() => toggleDay(d.key)}
                        className={[
                          "relative h-5 w-[38px] rounded-full border transition",
                          isOff ? "border-red-400 bg-white" : "border-sky-400 bg-white",
                        ].join(" ")}
                        aria-label={`toggle ${d.label}`}
                      >
                        <span
                          className={[
                            "absolute left-[2px] top-[2px] h-[14px] w-[14px] rounded-full transition-transform",
                            isOff ? "translate-x-0 bg-red-500" : "translate-x-[18px] bg-sky-400",
                          ].join(" ")}
                        />
                      </button>
                    </div>

                    <div className={isOff ? "pointer-events-none opacity-60" : ""}>
                      <div className="space-y-2">
                        {day.rows.map((row, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <SessionDropdown
                              value={row.sessionKey}
                              options={SESSION_OPTIONS}
                              disabled={isOff}
                              onChange={(val) => setRowField(d.key, idx, "sessionKey", val)}
                            />

                            <TimeDropdown
                              value={row.time}
                              disabled={isOff}
                              minuteStep={1}
                              onChange={(val) => setRowField(d.key, idx, "time", val)}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

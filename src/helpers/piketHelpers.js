export const getCardColor = (hari) => {
  const colors = {
    "senin": "bg-blue-100",
    "selasa": "bg-orange-100", 
    "rabu": "bg-purple-100",
    "kamis": "bg-yellow-100",
    "jumat": "bg-green-100"
  };
  
  const day = hari.toLowerCase();
  return colors[day] || "bg-gray-100";
};

export const getMemberCardColor = (hari) => {
  const colors = {
    "senin": "bg-[#C0E9FB]",
    "selasa": "bg-[#FFD2B7]",
    "rabu": "bg-[#D5C7FD]", 
    "kamis": "bg-[#FCDC94]",
    "jumat": "bg-[#9FD99B]"
  };
  
  const day = hari.toLowerCase();
  return colors[day] || "bg-white";
};

export const createScheduleByDay = (scheduleData) => {
  const scheduleByDay = {}; 
  
  scheduleData.forEach(day => {
    scheduleByDay[day.hari.toLowerCase()] = day;
  });

  return scheduleByDay;
};

export const getWorkingDays = (FULL_DAY_LABELS) => {
  return FULL_DAY_LABELS.slice(1, 6);
};
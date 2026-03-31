import React from 'react';

const ProgresProject = ({ progressPercent = 0 }) => {
    let barColor;
    if (progressPercent === 0) {
        barColor = 'bg-[#FF0002]';
    } else if (progressPercent > 0 && progressPercent < 100) {
        barColor = 'bg-[#FF8C00]';
    } else {
        barColor = 'bg-[#16A34A]';
    }

    const barWidth = `${progressPercent}%`;

    return (
        <div className="relative w-full"> 
            <span className="absolute top-0 right-0 font-semibold text-lg text-gray-700 -mt-8">{progressPercent}%</span>
            <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div 
                    className={`${barColor} h-2 rounded-full`}
                    style={{ width: barWidth, transition: 'width 0.5s ease-in-out' }}>
                </div>
            </div>
        </div>
    );
};

export default ProgresProject;
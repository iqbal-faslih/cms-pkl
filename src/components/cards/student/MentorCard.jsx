import React from 'react';

const MentorCard = ({ mentorName, mentorTitle, mentorPhotoUrl }) => {
  return (
    <div className="flex items-center space-x-4">
      <div className="flex-shrink-0">
        <img
          className="h-12 w-12 rounded-full object-cover"
          src={mentorPhotoUrl || "/assets/default-avatar.png"}
          alt={`${mentorName}'s profile`}
        />
      </div>
      <div>
        <h3 className="text-md font-semibold text-gray-900">{mentorName}</h3>
        <p className="text-xs text-gray-500">{mentorTitle}</p>
      </div>
    </div>
  );
};

export default MentorCard;
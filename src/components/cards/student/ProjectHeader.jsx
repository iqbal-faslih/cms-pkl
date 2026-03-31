import React from "react";

const ProjectHeader = ({ projectTitle, studentTitle }) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{projectTitle}</h1>
      </div>
      <div className="flex items-center space-x-3">
        <div className="px-3 py-1 text-sm font-medium text-blue-800 bg-blue-100 rounded-full">
          {studentTitle}
        </div>
      </div>
    </div>
  );
};

export default ProjectHeader;
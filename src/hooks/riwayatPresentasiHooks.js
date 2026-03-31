import { useState } from "react";

export const useProjectFilter = (availableProjects) => {
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [selectAll, setSelectAll] = useState(true);
  const [mainFilterOpen, setMainFilterOpen] = useState(false);

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectAll(false);
      setSelectedProjects([]);
    } else {
      setSelectAll(true);
      setSelectedProjects([...availableProjects]);
    }
  };

  const handleProjectToggle = (project) => {
    const isSelected = selectedProjects.includes(project);
    let newSelectedProjects = isSelected
      ? selectedProjects.filter(p => p !== project)
      : [...selectedProjects, project];

    setSelectedProjects(newSelectedProjects);
    setSelectAll(newSelectedProjects.length === availableProjects.length);
  };

  const isProjectMatch = (meeting) => {
    return selectAll || selectedProjects.length === 0 || selectedProjects.includes(meeting.project);
  };

  return { selectedProjects, selectAll, mainFilterOpen, setMainFilterOpen, handleSelectAll, handleProjectToggle, isProjectMatch };
};

export const useStatusFilter = (availableStatuses = []) => {
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [selectAllStatus, setSelectAllStatus] = useState(true);
  const [statusFilterOpen, setStatusFilterOpen] = useState(false);

  const handleSelectAllStatus = () => {
    if (selectAllStatus) {
      setSelectAllStatus(false);
      setSelectedStatuses([]);
    } else {
      setSelectAllStatus(true);
      setSelectedStatuses([...availableStatuses]);
    }
  };

  const handleStatusToggle = (status) => {
    const isSelected = selectedStatuses.includes(status);
    let newSelectedStatuses = isSelected
      ? selectedStatuses.filter(s => s !== status)
      : [...selectedStatuses, status];
    setSelectedStatuses(newSelectedStatuses);
    setSelectAllStatus(newSelectedStatuses.length === availableStatuses.length);
  };

  const isStatusMatch = (meeting) => {
    return selectAllStatus || selectedStatuses.length === 0 || selectedStatuses.includes(meeting.status);
  };

  return { availableStatuses, selectedStatuses, selectAllStatus, statusFilterOpen, setStatusFilterOpen, handleSelectAllStatus, handleStatusToggle, isStatusMatch };
};


// Search
export const useSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (e) => setSearchQuery(e.target.value);
  const clearSearch = () => setSearchQuery("");

  const isSearchMatch = (meeting) => {
    if (!searchQuery) return true;
    const searchLower = searchQuery.toLowerCase();
    return (
      meeting.project.toLowerCase().includes(searchLower) ||
      meeting.date.toLowerCase().includes(searchLower) ||
      meeting.time.toLowerCase().includes(searchLower) ||
      meeting.method.toLowerCase().includes(searchLower) ||
      meeting.location.toLowerCase().includes(searchLower) ||
      meeting.status.toLowerCase().includes(searchLower)
    );
  };

  return { searchQuery, handleSearchChange, clearSearch, isSearchMatch };
};

// Pagination
export const usePagination = (filteredData, itemsPerPage = 15) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const resetToFirstPage = () => setCurrentPage(1);

  return { currentPage, totalPages, currentItems, indexOfFirstItem, indexOfLastItem, paginate, nextPage, prevPage, resetToFirstPage };
};

// Filtered Meetings
export const useFilteredMeetings = (allMeetings, projectFilter, statusFilter, search) => {
  return allMeetings.filter(meeting =>
    projectFilter.isProjectMatch(meeting) &&
    statusFilter.isStatusMatch(meeting) &&
    search.isSearchMatch(meeting)
  );
};

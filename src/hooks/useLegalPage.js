import { useState, useEffect } from "react";
import { useSearchParams } from 'react-router-dom';

export const useLegalPageLogic = () => {
  const [currentPage, setCurrentPage] = useState('terms');
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const pageFromUrl = searchParams.get('page');
    if (pageFromUrl === 'privacy') {
      setCurrentPage('privacy');
    } else {
      setCurrentPage('terms');
    }
  }, [searchParams]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setSearchParams({ page });
  };

  return { currentPage, handlePageChange };
};
import { useState, useEffect } from 'react';
import { 
  transformPresentationData, 
  isPresentationAvailable, 
  getButtonLabel 
} from '../helpers/presentationHelper';
import { getPresentasiSiswa } from '../helpers/apiClient';

/**
 * @returns {Object} 
 */
export const usePresentation = () => {
  const [presentations, setPresentations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  const fetchPresentations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getPresentasiSiswa();

      console.log('API Response:', response.data);
      
      let apiData;
      if (response.data.status === "success" && response.data.data) {
        apiData = response.data.data;
      } else if (Array.isArray(response.data)) {
        apiData = response.data;
      } else {
        throw new Error('Invalid API response structure');
      }

      if (!Array.isArray(apiData)) {
        console.error('API data is not an array:', apiData);
        throw new Error('Data presentasi tidak dalam format yang benar');
      }

      const transformedData = transformPresentationData(apiData);
      setPresentations(transformedData);
    } catch (err) {
      console.error('Error fetching presentations:', err);
      setError(err.response?.data?.message || err.message || 'Gagal mengambil data presentasi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPresentations();
  }, [refetchTrigger]);

  const refetch = () => {
    setRefetchTrigger(prev => prev + 1);
  };

  const getPresentationById = (id) => {
    return presentations.find(presentation => presentation.id === id);
  };

  const getPresentationsByStatus = (status) => {
    return presentations.filter(presentation => presentation.status === status);
  };

  const getAvailablePresentations = () => {
    return presentations.filter(presentation => isPresentationAvailable(presentation));
  };

  const getTotalQuota = () => {
    return presentations.reduce((total, presentation) => total + presentation.kuota, 0);
  };

  const getTotalApplicants = () => {
    return presentations.reduce((total, presentation) => total + presentation.applicants, 0);
  };

  const getPresentationStats = () => {
    const stats = presentations.reduce((acc, presentation) => {
      acc[presentation.status] = (acc[presentation.status] || 0) + 1;
      return acc;
    }, {});

    return {
      total: presentations.length,
      selesai: stats['Selesai'] || 0,
      dijadwalkan: stats['Dijadwalkan'] || 0,
      berlangsung: stats['Berlangsung'] || 0,
      dibatalkan: stats['Dibatalkan'] || 0,
      available: getAvailablePresentations().length
    };
  };

  const sortPresentations = (sortBy = 'date', order = 'asc') => {
    const sorted = [...presentations].sort((a, b) => {
      let compareValue = 0;
      
      switch (sortBy) {
        case 'date':
          compareValue = new Date(a.date) - new Date(b.date);
          break;
        case 'status':
          compareValue = a.status.localeCompare(b.status);
          break;
        case 'kuota':
          compareValue = a.kuota - b.kuota;
          break;
        case 'applicants':
          compareValue = a.applicants - b.applicants;
          break;
        case 'tipe':
          compareValue = a.tipe.localeCompare(b.tipe);
          break;
        default:
          compareValue = 0;
      }
      
      return order === 'desc' ? -compareValue : compareValue;
    });

    return sorted;
  };

  const filterPresentations = (filters) => {
    return presentations.filter(presentation => {
      let match = true;

      if (filters.status && filters.status.length > 0) {
        match = match && filters.status.includes(presentation.status);
      }

      if (filters.tipe) {
        match = match && presentation.tipe.toLowerCase().includes(filters.tipe.toLowerCase());
      }

      if (filters.dateFrom) {
        match = match && new Date(presentation.date) >= new Date(filters.dateFrom);
      }

      if (filters.dateTo) {
        match = match && new Date(presentation.date) <= new Date(filters.dateTo);
      }

      if (filters.availableOnly) {
        match = match && isPresentationAvailable(presentation);
      }

      return match;
    });
  };

  const getButtonProps = (presentation) => {
    const isAvailable = isPresentationAvailable(presentation);
    const label = getButtonLabel(presentation.status, isAvailable);
    
    return {
      label,
      disabled: presentation.status === 'Dibatalkan' || !isAvailable,
      variant: presentation.status === 'Selesai' ? 'outline' : 'default'
    };
  };

  return {
    // Data
    presentations,
    loading,
    error,
    
    // Actions
    refetch,
    fetchPresentations,
    
    // Getters
    getPresentationById,
    getPresentationsByStatus,
    getAvailablePresentations,
    getTotalQuota,
    getTotalApplicants,
    getPresentationStats,
    
    // Utilities
    sortPresentations,
    filterPresentations,
    getButtonProps,
    
    // Helper functions 
    isPresentationAvailable,
    getButtonLabel
  };
};
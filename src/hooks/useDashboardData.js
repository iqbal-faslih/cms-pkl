import { useFetch } from '@/shared/hooks/requests/useFetch';

export const useDashboardData = (companyId) => {
  const { data: dashboardData, loading, error, refetch } = useFetch(`/dashboard-superadmin/daftar-perusahaan/${companyId}/detail`);

  // Transform the single response to match the existing structure
  const cardData = dashboardData?.data ? {
    greenCard: {
      totalCabang: dashboardData.data.total_cabang,
      data: dashboardData.data.statistik_peserta // Use statistik_peserta for the mini chart
    },
    orangeCard: {
      totalPeserta: dashboardData.data.total_peserta,
      data: dashboardData.data.statistik_peserta // Use statistik_peserta for the mini chart
    }
  } : null;

  const areaChartData = dashboardData?.data?.statistik_kehadiran || null;
  const barChartData = dashboardData?.data?.statistik_peserta || null;

  console.log(areaChartData);

  return {
    cardData,
    areaChartData,
    barChartData,
    loading,
    error,
    refetch
  };
};

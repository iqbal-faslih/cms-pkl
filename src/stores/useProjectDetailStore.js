import { create } from 'zustand';
import { getDetailProject } from '../helpers/apiClient';

const useProjectDetailStore = create((set, get) => ({
  detailProject: null,
  detailLoading: false,
  detailError: null,
  activeFilter: 'semua',

  // Mengambil data dari API
  fetchDetailProject: async (routeId) => {
    set({ detailLoading: true, detailError: null });
    try {
      const response = await getDetailProject(routeId);
      set({ detailProject: response.data.data, detailLoading: false });
    } catch (err) {
      set({ detailError: err.response?.data?.message || "Gagal memuat data proyek.", detailLoading: false });
    }
  },

  // Mengubah filter
  setActiveFilter: (filter) => set({ activeFilter: filter }),

  // Menambah revisi baru
  handleAddRevision: () => {
    set(state => {
      const nextId = state.detailProject.revisi.length > 0
        ? Math.max(...state.detailProject.revisi.map(r => r.id)) + 1
        : 1;

      const newRevision = {
        id: nextId,
        status: "belum dikerjakan",
        tanggal: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }),
        tugas: [],
        isLate: false,
      };

      return {
        detailProject: {
          ...state.detailProject,
          revisi: [newRevision, ...state.detailProject.revisi],
        },
      };
    });
  },

  // Update Revisi
  handleUpdateRevision: (revisionId, updates) => {
    set(state => ({
      detailProject: {
        ...state.detailProject,
        revisi: state.detailProject.revisi.map(rev =>
          rev.id === revisionId ? { ...rev, ...updates } : rev
        ),
      },
    }));
  },

  // Menambah tugas baru
  handleAddTask: (revisionId) => {
    set(state => ({
      detailProject: {
        ...state.detailProject,
        revisi: state.detailProject.revisi.map(rev =>
          rev.id === revisionId
            ? {
                ...rev,
                tugas: [...rev.tugas, { id: Date.now(), deskripsi: "", selesai: false }],
              }
            : rev
        ),
      },
    }));
  },

  // Memperbarui tugas
  handleUpdateTask: (revisionId, taskIndex, updates) => {
    set(state => ({
      detailProject: {
        ...state.detailProject,
        revisi: state.detailProject.revisi.map(rev =>
          rev.id === revisionId
            ? {
                ...rev,
                tugas: rev.tugas.map((t, i) =>
                  i === taskIndex ? { ...t, ...updates } : t
                ),
              }
            : rev
        ),
      },
    }));
  },
}));

export default useProjectDetailStore;
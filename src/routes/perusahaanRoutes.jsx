import PerusahaanLayout from "../layout/PerusahaanLayout";
import KelolaCabang from "../pages/perusahaan/KelolaCabang";
import CabangPerusahaan from "../pages/perusahaan/CabangPerusahaan";
import SettingsPerusahaan from "../pages/perusahaan/profile-settings/SettingsPerusahaan";
import PerusahaanForm from "../pages/perusahaan/Registrasi/PerusahaanForm";
import Lowongan from "../pages/perusahaan/lowongan";
import Mitra from "../pages/perusahaan/Mitra";
import Dashboard from "../pages/perusahaan/dashboard/Dashboard";
import DetailCabangLayout from "../layout/DetailCabangLayout";
// import JamKantor from "../pages/perusahaan/Jam-kantor";

import TambahMentor from "../pages/perusahaan/mentor/TambahMentor";
// import TambahCabang from "../pages/perusahaan/TambahCabang";

import BerandaPerusahaan from "../pages/perusahaan/BerandaPerusahaan";
import Admin from "../pages/perusahaan/Admin";
import Mentor from "../pages/perusahaan/mentor/Mentor";
import Peserta from "../pages/perusahaan/Peserta";
import Divisi from "../pages/perusahaan/divisi/Divisi";
import ApprovalPerusahaan from "../pages/perusahaan/approval/Approval";
import Pendataan from "../pages/perusahaan/Pendataan";
import DataAbsensi from "../pages/perusahaan/Absensi";
import RFID from "../pages/perusahaan/RFID/RFID";
import Detailsmentor from "../components/cards/DetailMentor";
import Piket from "../pages/perusahaan/piket";
import Jamkantor from "../pages/perusahaan/Jam-kantor";
import Laporan from "../pages/perusahaan/Laporan";
import SettingCabang from "../pages/perusahaan/SettingCabang";
import ProtectedRoute from "./ProtectedRoute";
import LengkapiData from "../pages/perusahaan/LengkapiData";
import ManagementCabanng from "../pages/perusahaan/ManagementCabang";
import JurnalPerusahaan from "../pages/perusahaan/jurnal/JurnalPerusahaan";
import DataDiri from "../pages/perusahaan/DataDiriPerusahaan";
import Password from "../pages/perusahaan/PasswordPerusahaan";
import { Navigate } from "react-router-dom";
import RFIDTable from "../components/cards/DataRFID";
import ProfilPerusahaan from "../pages/perusahaan/ProfilPerusahaan";
import HalamanDetailMentor from "../pages/perusahaan/mentor/detail-mentor/HalamanDetailMentor";
import TambahAdmin from "../pages/perusahaan/TambahAdmin";
import AdminForm from "../pages/perusahaan/Admin/AdminForm";
import DetailSurat from "../pages/perusahaan/surat/components/DetailSuratPenerimaan";
import DataSurat from "../pages/perusahaan/surat/DataSurat";
import DetailPeserta from "../pages/perusahaan/DetailPeserta/DetailPeserta";
import SesiJamKantor from "../pages/perusahaan/JamKantor/SesiJamKantor";
import BaseJamKantor from "../pages/perusahaan/JamKantor/BaseJamKantor";
import SuratPeringatanForm from "../pages/cabang/SuratPeringatanForm";
import CompanyCard from "../pages/perusahaan/profile-settings/SettingsPerusahaan";
import TambahCabang from "../pages/perusahaan/TambahCabang";
import ProtectedPerusahaanRoute from "./ProtectedPerusahaanRoute";
import { StatusPerusahaanProvider } from "../contexts/StatusPerusahaanContext";
import SettingJamKantor from "../pages/perusahaan/JamKantor/SettingJamKantor";

export default {
  path: "/perusahaan",
  element: <ProtectedRoute allowedRoles={["perusahaan"]} />,
  children: [
    {
      path: "",
      element: (
        <StatusPerusahaanProvider>
          <PerusahaanLayout />
        </StatusPerusahaanProvider>
      ),
      children: [
        {
          path: "",
          element: <ProtectedPerusahaanRoute />,
          children: [
            { path: "dashboard", element: <Dashboard /> },
            { path: "registrasi", element: <PerusahaanForm /> },
            { path: "profile-settings", element: <CompanyCard /> },
            { path: "peserta", element: <Peserta /> },
            { path: "peserta/:id/detail", element: <DetailPeserta /> },
            { path: "divisi", element: <Divisi /> },
            { path: "approval", element: <ApprovalPerusahaan /> },
            { path: "jurnal", element: <JurnalPerusahaan /> },
            { path: "absensi", element: <DataAbsensi /> },
            { path: "surat", element: <DataSurat /> },
            { path: "RFID", element: <RFID /> },
            { path: "mentor", element: <Mentor /> },
            { path: "mentor/tambah-mentor", element: <TambahMentor /> },
            { path: "mentor/:id/edit", element: <TambahMentor /> },
            { path: "mentor/:id/detail", element: <HalamanDetailMentor /> },
            { path: "kelola-cabang", element: <CabangPerusahaan /> },
            { path: "kelola-cabang/tambah", element: <TambahCabang /> },
            { path: "kelola-cabang/:slug/detail", element: <KelolaCabang /> },
            { path: "kelola-lowongan", element: <Lowongan /> },
            { path: "data-diri", element: <DataDiri /> },
            { path: "jam-kantor", element: <BaseJamKantor /> },
            { path: "jam-kantor-setting", element: <SettingJamKantor /> },
            { path: "jam-kantor-sesi", element: <SesiJamKantor /> },
          ],
        },
      ],
    },
  ],
};


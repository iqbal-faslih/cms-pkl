import CabangLayout from "../layout/CabangLayout";
import CabangPerusahaan from "../pages/perusahaan/CabangPerusahaan";
import Lowongan from "../pages/perusahaan/lowongan";
import Mitra from "../pages/perusahaan/Mitra";
import DetailCabangLayout from "../layout/DetailCabangLayout";
import ProfilAkun from "../pages/cabang/ProfilAkun";

import Admin from "../pages/perusahaan/Admin";
import Mentor from "../pages/perusahaan/mentor/Mentor";
import Peserta from "../pages/perusahaan/Peserta";
import Divisi from "../pages/perusahaan/divisi/Divisi";
import DataAbsensi from "../pages/perusahaan/Absensi";
import Detailsmentor from "../components/cards/DetailMentor";
import DetailPeserta from "../pages/cabang/detail-peserta/DetailPesertaCabang";
import Piket from "../pages/perusahaan/piket";
import Jamkantor from "../pages/perusahaan/Jam-kantor";
import Laporan from "../pages/perusahaan/Laporan";
import SettingCabang from "../pages/perusahaan/SettingCabang";
import ProtectedRoute from "./ProtectedRoute";
import LengkapiData from "../pages/perusahaan/LengkapiData";
import { Navigate } from "react-router-dom";
import SuratPeringatanForm from "../pages/cabang/SuratPeringatanForm";
import DataSurat from "../pages/perusahaan/surat/DataSurat";
import TambahCabang from "../pages/perusahaan/TambahCabang";
import RfidCabang from "../pages/cabang/CabangRFID/RfidCabang";
import ProfileSettings from "../pages/cabang/profile-settings/ProfileSettings";
import AdminLayout from "../layout/AdminLayout";
import ApprovalCabang from "../pages/cabang/approval/ApprovalCabang";
import JurnalPerusahaan from "../pages/perusahaan/jurnal/JurnalPerusahaan";

export default {
  path: "/admin",
  element: <ProtectedRoute allowedRoles={["admin"]} />,
  children: [
    {
      path: "",
      element: <AdminLayout />,
      children: [
        { index: true, element: <Navigate to="dashboard" replace /> },
        // { path: "registrasi", element: < /> },
        { path: "dashboard" },
        // { path: "profile-saya", element: < /> },//TARUH PROFILE SETTINGS PERUSAHAAN DISINI
        { path: "mentor", element: <Mentor /> },
        // { path: "admin/:id/detail", element: < /> },//TARUH HALAMAN DETAIL ADMIN DISINI
        { path: "mentor/:id/detail", element: <Detailsmentor /> },
        { path: "peserta", element: <Peserta /> },
        { path: "peserta/:id/detail", element: <DetailPeserta /> },
        { path: "divisi", element: <Divisi /> },
        { path: "jurnal", element: <JurnalPerusahaan /> },
        { path: "absensi", element: <DataAbsensi /> },
        { path: "surat", element: <DataSurat /> },
        { path: "RFID", element: <RfidCabang /> },
        { path: "piket", element: <Piket /> },
        { path: "jam-kantor", element: <Jamkantor /> },
        { path: "laporan", element: <Laporan /> },
        { path: "profile-settings", element: <ProfileSettings /> },
        { path: "approval", element: <ApprovalCabang /> },
        { path: "surat/create/surat-peringatan", element: <SuratPeringatanForm />},
      ],
    },
  ],
};


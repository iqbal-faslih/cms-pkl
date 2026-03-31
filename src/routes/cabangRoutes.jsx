import CabangLayout from "../layout/CabangLayout";
import Lowongan from "../pages/perusahaan/lowongan";
import Dashboard from "../pages/cabang/Dashboard";

import Admin from "../pages/perusahaan/Admin";
import Mentor from "../pages/perusahaan/mentor/Mentor";
import TambahMentor from "../pages/perusahaan/mentor/TambahMentor";
import HalamanDetailMentor from "../pages/perusahaan/mentor/detail-mentor/HalamanDetailMentor";
import Divisi from "../pages/perusahaan/divisi/Divisi";
import AdminCabang from "../pages/cabang/AdminCabang";
import JurnalCabang from "../pages/cabang/jurnal/JurnalCabang";
import DetailPeserta from "../pages/cabang/detail-peserta/DetailPesertaCabang";
import Piket from "../pages/perusahaan/piket";
import Jamkantor from "../pages/perusahaan/Jam-kantor";
import Laporan from "../pages/perusahaan/Laporan";
import ProtectedRoute from "./ProtectedRoute";
import LengkapiData from "../pages/perusahaan/LengkapiData";
import { Navigate } from "react-router-dom";
import SuratPeringatanForm from "../pages/cabang/SuratPeringatanForm";
import DataSurat from "../pages/perusahaan/surat/DataSurat";
import TabelJamKantor from "../pages/cabang/jam-kantor/TabelSesiCabang";
import JamKantorCabang from "../pages/cabang/jam-kantor/BaseJamKantorCabang";
import DetailSurat from "../pages/cabang/surat/DetailSuratPeringatan";
import ProfileSettings from"../pages/cabang/profile-settings/ProfileSettings";
import RfidCabang from "../pages/cabang/CabangRFID/RfidCabang";
import ApprovalCabang from "../pages/cabang/approval/ApprovalCabang"
import AbsensiCabang from "../pages/cabang/AbsensiCabang";
import PesertaCabang from "../pages/perusahaan/cabang/peserta/PesertaCabang";

export default {
  path: "/cabang",
  element: <ProtectedRoute allowedRoles={["cabang"]} />,
  children: [
    {
      path: "",
      element: <CabangLayout />,
      children: [
        { index: true, element: <Navigate to="dashboard" replace /> },
        // { path: "registrasi", element: < /> },
        { path: "dashboard", element: <Dashboard /> },
        { path: "lengkapi-data", element: <LengkapiData /> },
        { path: "mentor", element: <Mentor /> },
        { path: "mentor/tambah-mentor", element: <TambahMentor /> },
        { path: "mentor/:id/edit", element: <TambahMentor /> },
        { path: "mentor/:id/detail", element: <HalamanDetailMentor /> },
        { path: "admin", element: <Admin /> },
        { path: "peserta", element: <PesertaCabang /> },
        { path: "peserta/:id/detail", element: <DetailPeserta /> },
        { path: "divisi", element: <Divisi /> },
        { path: "kelola-lowongan", element: <Lowongan /> },
        { path: "admin-cabang", element: <AdminCabang /> },
        { path: "jurnal", element: <JurnalCabang /> },
        { path: "absensi", element: <AbsensiCabang /> },
        { path: "surat", element: <DataSurat /> },
        { path: "detail-surat", element: <DetailSurat /> },
        { path: "RFID", element: <RfidCabang /> },
        { path: "piket", element: <Piket /> },
        // { path: "jam-kantor", element: <Jamkantor /> },
        { path: "jam-kantor", element: <JamKantorCabang/>},
        { path: "jam-kantor-sesi", element: <TabelJamKantor /> },
        { path: "jam-kantor-setting", element: <Jamkantor /> },
        { path: "laporan", element: <Laporan /> },
        { path: "profile-settings", element: <ProfileSettings /> },
        { path: "approval", element: <ApprovalCabang /> },
        { path: "surat/create/surat-peringatan", element: <SuratPeringatanForm />},
      ],
    },
  ],
};


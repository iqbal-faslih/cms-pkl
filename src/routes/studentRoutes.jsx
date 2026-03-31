import StudentLayout from "../layout/StudentLayout";
import Dashboard from "../pages/student/Dashboard";
import Absensi from "../pages/student/Absensi";
import Jurnal from "../pages/student/Jurnal";
import Presentasi from "../pages/student/Presentasi";
import Presentasi2 from "../pages/student/Presentasi2";
import DetailPresentasi from "../pages/student/DetailPresentasi";
import RiwayatPresentasi2 from "../pages/student/RiwayatPresentasi2";
import RegistrasiPeserta from "../pages/student/RegistrasiPeserta";
import JadwalPiket from "../pages/student/JadwalPiket";
import ProfilePeserta from "../pages/student/ProfilePeserta";
import RouteProject from "../pages/student/RouteProject";
import DetailProjectNew from "../pages/student/DetailProjectNew";
import StatusProvider from "../pages/student/StatusContext";
import PasswordPeserta from "../components/cards/PasswordPeserta"
import RiwayatLowongan from "../pages/student/RiwayatLowongan";

import { Navigate } from "react-router-dom";
import ProtectedRoute from "../routes/ProtectedRoute";
import ProtectedStatusRoute from "../routes/ProtectedStatusRoute";

export default {
  path: "/peserta",
  element: <ProtectedRoute allowedRoles={["peserta"]} />,
  children: [
    {
      path: "",
      element: (
        <StatusProvider>
          <StudentLayout />
        </StatusProvider>
      ),
      children: [
        {
          path: "",
          element: <ProtectedStatusRoute />,
          children: [
            { index: true, element: <Navigate to="dashboard" replace /> },
            { path: "dashboard", element: <Dashboard /> },
            { path: "absensi", element: <Absensi /> },
            { path: "jurnal", element: <Jurnal /> },
            { path: "jadwal-presentasi", element: <Presentasi /> },
            { path: "presentasi2", element: <Presentasi2 /> },
            { path: "detail-presentasi", element: <DetailPresentasi /> },
            { path: "riwayat-presentasi", element: <RiwayatPresentasi2 /> },
            { path: "registrasi", element: <RegistrasiPeserta /> },
            { path: "piket", element: <JadwalPiket /> },
            { path: "profile-settings", element: <ProfilePeserta /> },
            { path: "riwayat-lowongan", element: <RiwayatLowongan /> },
            { path: "kata-sandi", element: <PasswordPeserta /> },
            { path: "route-project", element: <RouteProject />},
            { path: "detail-project/:routeId", element: <DetailProjectNew /> },
          ],
        },
      ],
    },
  ],
};

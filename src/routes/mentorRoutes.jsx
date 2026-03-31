import MentorDashboard from "../pages/mentor/dashboard/MentorDashboard";
import MentorLayout from "../layout/MentorLayout";
import { Navigate } from "react-router-dom";
import PesertaPage from "../pages/mentor/menu-peserta/PesertaPage";
import DetailPeserta from "../pages/mentor/menu-peserta/DetailPeserta";
import DetailRevisi from "../pages/mentor/menu-peserta/DetailRevisi";
import Presentasi from "../pages/mentor/presentasi/Presentasi";
import ProfileMentorForm from "../pages/mentor/ProfileMentor/ProfileMentorForm";

export default {
    path: "/mentor",
    element: <MentorLayout />,
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: "dashboard", element: <MentorDashboard /> },
      { path: "peserta", element: <PesertaPage /> },
      { path: "presentasi", element: <Presentasi /> },
      { path: "peserta/:id/detail", element: <DetailPeserta /> },
      { path: "peserta/:id/detail/revisi/:id", element: <DetailRevisi /> },
      { path: "profile-settings", element: <ProfileMentorForm/>},
    ],
};

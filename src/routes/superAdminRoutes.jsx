import SuperadminLayout from "../layout/SuperadminLayout";
import DetailCabangLayout from "../layout/DetailCabangLayout";

import DashboardSuperadmin from "../pages/superadmin/dashboard/Dashboard";
import DataPerusahaan from "../pages/superadmin/manajemen-perusahaan/DataPerusahaan";
import ManajemenPost from "../pages/superadmin/ManajemenPost";
import PostForm from "../pages/superadmin/PostForm";
import ManajementArtikel from "../pages/superadmin/ManajementArtikel";
import CabangDashboard from "../pages/superadmin/CabangDashboard";
import DetailDashboard from "../pages/superadmin/DetailDashboard";
import DaftarCabang from "../pages/superadmin/daftar-cabang/TableCabang";
import ApprovalPerusahaan from "../pages/perusahaan/ApprovalPerusahaan";
import { Navigate } from "react-router-dom";
import DetailDashboardLayout from "../layout/DetailDashboardSuperadminLayout";
import ProfilAccount from "../pages/superadmin/ProfileAccount/ProfileAccount";
import ProtectedRoute from "./ProtectedRoute";

export default {
  path: "/superadmin",
  element: <ProtectedRoute allowedRoles={["superadmin"]} />,
  children: [
    {
      path: "",
      element: <SuperadminLayout />,
      children: [
        { index: true, element: <Navigate to="dashboard" replace /> },
        { path: "dashboard", element: <DashboardSuperadmin /> },
        { path: "manajemen-perusahaan", element: <DataPerusahaan /> },
        { path: "manajemen-artikel", element: <ManajementArtikel /> },
        { path: "manajemen-artikel/create", element: <PostForm /> },
        { path: "manajemen-artikel/:id/edit", element: <PostForm /> },
    

        // approval Tambahkan baris ini:
        { path: "approval", element: <ApprovalPerusahaan /> },
        { path: "cabang-dashboard", element: <CabangDashboard /> },
        {path: "profile-settings", element: <ProfilAccount />},


        // untuk detail dashboard
        {
          path: "manajemen-perusahaan/:companyId",
          element: <DetailDashboardLayout />,
          children: [
            { index: true, element: <Navigate to="detail-perusahaan" replace /> }, 
            { path: "detail-perusahaan", element: <DetailDashboard /> },
            { path: "daftar-cabang", element: <DaftarCabang /> },
          ],
        },
      ],
    },
  ],
};

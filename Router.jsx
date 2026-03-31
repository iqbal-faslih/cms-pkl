import { createBrowserRouter } from "react-router-dom";
import guestRoutes from "./src/routes/guestRoutes";
import authRoutes from "./src/routes/authRoutes";
import studentRoutes from "./src/routes/studentRoutes";
import mentorRoutes from "./src/routes/mentorRoutes";
import perusahaanRoutes from "./src/routes/perusahaanRoutes";
import superAdminRoutes from "./src/routes/superAdminRoutes";
import cabangRoutes from "./src/routes/cabangRoutes";
import notFoundRoute from "./src/routes/notFoundRoute";
import adminRoutes from "./src/routes/adminRoutes";

export const router = createBrowserRouter([
  guestRoutes,
  authRoutes,
  studentRoutes,
  mentorRoutes,
  perusahaanRoutes,
  superAdminRoutes,
  cabangRoutes,
  notFoundRoute,
  adminRoutes,
]);

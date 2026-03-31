import GuestLayout from "../layout/GuestLayout";
import Index from "../pages/Index";
import About from "../pages/About";
import Procedure from "../pages/Procedure";
import Contact from "../pages/Contact";
import Vacancy from "../pages/Vacancy";
import VacancyDetails from "../pages/VacancyDetails";
import Post from "../pages/Post";
import PostDetail from "../pages/PostDetail";
import CategoryPage from "../pages/CategoryPage";
import TagPage from "../pages/TagPage";
import LegalPage from "../pages/LegalPage";
import MitraDetails from "../components/section/MitraDetails";
import ProtectedLowonganRoute from "./ProtectedLowonganRoute";

export default {
  path: "/",
  element: <GuestLayout />,
  children: [
    { index: true, element: <Index /> },
    { path: "tentang", element: <About /> },
    { path: "prosedur", element: <Procedure /> },
    { path: "hubungi-kami", element: <Contact /> },
    {
      path: "lowongan",
      element: <ProtectedLowonganRoute />,
      children: [
        { index: true, element: <Vacancy /> },
        { path: ":jobId", element: <VacancyDetails /> },
      ],
    },
    { path: "post", element: <Post />},
    { path: "post/:id", element: <PostDetail />},
    { path: "kategori/:categoryName", element: <CategoryPage /> },
    { path: "tags/:tagName", element: <TagPage /> },
    { path: "legal", element:<LegalPage />},
    { path: "mitradetails/:id", element: <MitraDetails /> },
  ],
};

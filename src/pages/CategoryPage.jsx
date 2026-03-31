import React, {useState, useMemo} from "react";
import { useParams, Link } from "react-router-dom";
import Banner from "../components/Banner";
import SidebarPost from "../components/section/SidebarPost";
import { usePostsByCategory } from "../hooks/usePostByCategory";
import PostList from "../components/section/PostList";

const CategoryPage = () => {
  const { categoryName } = useParams();
  const { posts, loading, error } = usePostsByCategory(categoryName);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPosts = useMemo(() => {
    if (!searchTerm) return posts;
    return posts.filter((post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, posts]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl font-semibold">
        Memuat postingan...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-xl font-semibold text-red-600">
        Terjadi kesalahan: Gagal memuat postingan.
      </div>
    );
  }

  return (
    <>
      <Banner
        title="Post"
        subtitle="Beranda → Post"
        backgroundImage="/assets/img/banner/study_tim.jpg"
        possitionIlustration={`right-0 top-18 w-full h-screen z-10`}
        ilustration={`ilustration_blue`}
      />

      <div className="container mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <main className="lg:col-span-2">
          <div className="bg-white p-6 rounded-2xl shadow-md mb-8">
            <h1 className="text-3xl font-bold mb-4">
              Postingan untuk Kategori: <span className="text-blue-600 capitalize">{categoryName}</span>
            </h1>
            <Link to="/post" className="text-blue-600 hover:underline">
              Kembali ke semua postingan
            </Link>
          </div>

          <PostList posts={filteredPosts} />
        </main>

        <aside className="hidden lg:block">
          <SidebarPost searchTerm={searchTerm} setSearchTerm={setSearchTerm} posts={posts} />
        </aside>
      </div>
    </>
  );
};

export default CategoryPage;
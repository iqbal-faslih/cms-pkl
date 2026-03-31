import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import Banner from "../components/Banner";
import SidebarPost from "../components/section/SidebarPost";
import { usePostDetail } from "../hooks/usePostDetail";
import usePost from "../hooks/usePost";

const PostDetail = () => {
  const { id } = useParams();
  const { post, loading, error } = usePostDetail(id);
  const { posts } = usePost();
  const [searchTerm, setSearchTerm] = useState("");


   if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl font-semibold">
        Memuat...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-xl font-semibold text-red-600">
        Error: Gagal memuat detail artikel.
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex justify-center items-center h-screen text-xl font-semibold text-gray-600">
        Post tidak ditemukan.
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
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <Link to="/post" className="inline-flex items-center text-blue-600 hover:text-blue-800 transition duration-300 mb-8">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Kembali ke daftar post
            </Link>

            <img 
              src={post.image} 
              alt={post.title}
              className="w-full h-auto object-cover rounded-lg mb-6"
            />
            <div className="flex items-center text-sm text-gray-500 mb-4">
              <span className="font-light">{post.date}</span>
              <span className="mx-2 font-bold">•</span>
              <span className="font-normal text-blue-600">{post.category}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              {post.title}
            </h1>
            <div 
              className="text-gray-700 text-lg leading-relaxed prose max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            ></div>
          </div>
          
          <div className="mt-8">
            <span className="text-lg font-semibold text-gray-800">Tags: </span>
            <div className="flex flex-wrap gap-2 mt-2">
              {post.tags?.map((tag, index) => (
                <Link
                  key={index}
                  to={`/tags/${tag.toLowerCase()}`}
                  className="px-4 py-2 text-sm border border-gray-300 rounded-full hover:bg-blue-600 hover:text-white transition duration-200"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        </main>
       <aside className="hidden lg:block">
        <SidebarPost 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm} 
          posts={posts} 
        />
      </aside>
      </div>
    </>
  );
};

export default PostDetail;

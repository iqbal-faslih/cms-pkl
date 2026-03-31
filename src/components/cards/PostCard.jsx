import React from "react";

const PostCard = ({ post }) => (
  <div className="bg-white rounded-2xl shadow-md overflow-hidden transition-transform transform hover:scale-105 duration-300">
    <img
      src={post.image}
      alt={post.title}
      className="w-full h-48 object-cover"
    />
    <div className="p-6">
      <div className="flex items-center text-sm text-gray-500 mb-2">
        <span className="font-light">{post.date}</span>
        <span className="mx-2 font-bold">•</span>
        <span className="font-normal text-blue-600">{post.category}</span>
      </div>
      <h2 className="text-xl font-bold mb-2">{post.title}</h2>
      <p className="text-gray-600 text-sm mb-4 line-clamp-3">{post.excerpt}</p>
      <Link
        to={`/post/${post.id}`}
        className="text-blue-600 hover:text-blue-800 font-semibold transition duration-300"
      >
        Baca Selengkapnya →
      </Link>
    </div>
  </div>
);

export default PostCard;

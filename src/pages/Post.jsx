import React from "react";
import { motion } from "framer-motion";
import Banner from "../components/Banner";
import PostList from "../components/section/PostList";
import SidebarPost from "../components/section/SidebarPost";
import { useState } from "react";

const fadeUpVariant = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const Post = () => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <>
      <Banner
        title="Post"
        subtitle="Beranda → Post"
        backgroundImage="/assets/img/banner/study_tim.jpg"
        possitionIlustration={`right-0 top-18 w-full h-screen z-10`}
        ilustration={`ilustration_blue`}
      />

      <section className="container mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-12 gap-10">
        <motion.div
          className="lg:col-span-8"
          variants={fadeUpVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <PostList searchTerm={searchTerm} />
        </motion.div>

        <motion.div
          className="lg:col-span-4"
          variants={fadeUpVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <SidebarPost searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </motion.div>
      </section>
    </>
  );
};

export default Post;

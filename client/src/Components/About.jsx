
import React from "react";
import { motion } from "framer-motion";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#ccefff] to-[#e0f7ff] py-16 px-4 lg:px-12 flex items-center justify-center">
      <motion.div
        className="bg-white shadow-xl rounded-3xl w-full max-w-6xl p-6 md:p-12 flex flex-col md:flex-row items-center"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        {/* Illustration */}
        <motion.img
          src="assets/learning.png" // Replace with another undraw link if preferred
          alt="Learning Illustration"
          className="w-64 h-64 md:w-80 md:h-80 mb-8 md:mb-0 md:mr-10"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4 }}
        />

        {/* Text Content */}
        <div className="text-center md:text-left">
          <motion.h1
            className="text-4xl font-extrabold text-[#0099CC]  mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            About ICTAK LearnSphere
          </motion.h1>
            <motion.p
          className="text-lg text-gray-700 leading-relaxed max-w-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Welcome to <span className="font-semibold text-[#000000]">ICTAK LearnSphere</span>, a vibrant dataset gallery crafted especially for ICTAK students. Dive into organized resources across trending technologies like DSA, AI/ML, and Deep Learning. Whether you're exploring for knowledge or contributing to the learning journey, LearnSphere is your interactive space to connect, explore, and grow.
        </motion.p>

          {/* <motion.p
            className="text-lg text-gray-700 leading-relaxed max-w-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Welcome to <span className="font-semibold text-indigo-600">ICTAK LearnSphere</span> — a curated dataset gallery designed exclusively for ICTAK students. Explore categorized content in DSA, AI/ML, and Deep Learning, all aimed at enhancing your learning experience and bridging the gap between theory and real-world applications.
          </motion.p> */}
        </div>
      </motion.div>
    </div>
  );
};

export default About;


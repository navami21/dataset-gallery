

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const images = [
  "/assets/home.jpg",
  "/assets/home2.jpg",
  "/assets/home4.jpg",
  "/assets/home5.jpg",  
  "/assets/home6.jpg",
];

const fadeVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};


const slideLeftVariants = {
  initial: { opacity: 0, x: -50 },
  animate: { opacity: 1, x: 0 },
};

const slideRightVariants = {
  initial: { opacity: 0, x: 50 },
  animate: { opacity: 1, x: 0 },
};

const Home = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Auto slideshow with pause on hover
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [isHovered]);

  return (
    <section className="min-h-screen flex items-center justify-center px-6 md:px-10 pt-8 pb-4 bg-white overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center max-w-6xl w-full -mt-10">

        {/* Text Section */}
        <motion.div
          className="text-center md:text-left"
          variants={slideLeftVariants}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.h1
            className="text-[32px] sm:text-[36px] md:text-[40px] font-bold mb-4 leading-tight text-gray-900"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Discover Alumni Projects <br />
            <span className="text-gray-800">Unlock Your Learning Path</span>
          </motion.h1>

          <motion.p
            className="text-gray-600 mb-6 text-sm sm:text-base md:text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Learn from the footsteps of those before you – explore real projects,
            gain real insights, and build your future.
          </motion.p>

          <motion.div
            className="flex justify-center md:justify-start"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <Link
              to="/login"
              className="text-white font-bold bg-gradient-to-r from-[#0099cc] to-[#00b4d8] shadow-lg hover:bg-[#5EABD6] p-8 hover:text-black px-6 py-2 rounded-md transition duration-300"
            >
              Get started
            </Link>
          </motion.div>
        </motion.div>

        {/* Image Slideshow Section */}
       <motion.div
  className="relative transform -translate-y-4 overflow-hidden rounded-lg shadow-lg"
  onMouseEnter={() => setIsHovered(true)}
  onMouseLeave={() => setIsHovered(false)}
  variants={slideRightVariants}
  initial="initial"
  animate="animate"
  transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
>
  {/* Image container */}
  <div className="relative w-full h-[350px] md:h-[400px] rounded-lg">
    <AnimatePresence>
      {images.map((src, index) =>
        index === currentImage ? (
          <motion.img
            key={src}
            src={src}
            alt="Slideshow"
            variants={fadeVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full object-cover rounded-lg"
          />
        ) : null
      )}
    </AnimatePresence>
  </div>

  {/* Dots */}
  <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-2">
    {images.map((_, index) => (
      <div
        key={index}
        onClick={() => setCurrentImage(index)}
        className={`w-3 h-3 rounded-full cursor-pointer transition-all duration-300 ${
          index === currentImage ? "bg-[#00b4d8] scale-125" : "bg-gray-300"
        }`}
      />
    ))}
  </div>
</motion.div>


      </div>
    </section>
  );
};

export default Home;

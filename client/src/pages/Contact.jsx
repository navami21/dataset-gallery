import React from "react";
import { motion } from "framer-motion";
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa";

const Contact = () => {
  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center px-6 py-16"
      style={{
        backgroundImage: "url('/assets/background.png')",
      }}
    >
      <motion.div
        className="bg-white bg-opacity-90 shadow-2xl rounded-3xl max-w-5xl w-full p-10 grid grid-cols-1 md:grid-cols-2 gap-10 backdrop-blur-md"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Left Side – Info Section */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-3xl font-extrabold text-[#0099CC] mb-6">Contact Us</h2>
          <p className="text-gray-700 mb-6 leading-relaxed">
            Reach out to <span className="font-semibold text-[#0099CC]">ICT Academy of Kerala</span>.
            We are always ready to guide you regarding our courses, programs, or any technical support.
          </p>

          <div className="space-y-5">
            <div className="flex items-start gap-4">
              <FaMapMarkerAlt className="text-[#0099CC] text-xl mt-1" />
              <p className="text-gray-700">
                GF-1 Thejaswini Building, Technopark Rd,<br />
                Thiruvananthapuram, Kerala 695581
              </p>
            </div>
            <div className="flex items-center gap-4">
              <FaPhoneAlt className="text-[#0099CC] text-xl" />
              <a href="tel:+914712701238" className="text-gray-700 hover:text-[#0099CC] transition">
                +91 471 270 1238
              </a>
            </div>
            <div className="flex items-center gap-4">
              <FaEnvelope className="text-[#0099CC] text-xl" />
              <a href="mailto:info@ictkerala.org" className="text-gray-700 hover:text-[#0099CC] transition">
                info@ictkerala.org
              </a>
            </div>
          </div>
        </motion.div>

        {/* Right Side – Contact Form */}
        <motion.form
          className="space-y-5"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <input
            type="text"
            placeholder="Your Name"
            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0099CC]"
          />
          <input
            type="email"
            placeholder="Your Email"
            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0099CC]"
          />
          <textarea
            rows="4"
            placeholder="Your Message"
            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0099CC]"
          ></textarea>
          <button
            type="submit"
            className="w-full bg-[#0099CC] text-white py-3 rounded-xl hover:bg-[#007da8] transition font-semibold tracking-wide"
          >
            Send Message
          </button>
        </motion.form>
      </motion.div>
    </div>
  );
};

export default Contact;
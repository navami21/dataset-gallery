
import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
   
        <section className="min-h-screen flex items-center justify-center px-6 md:px-10 pt-8 pb-4 bg-white">

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center max-w-6xl w-full -mt-10">
      
        <div className="text-center md:text-left">
          <h1 className="text-[32px] sm:text-[36px] md:text-[40px] font-bold mb-4 leading-tight text-gray-900">
            Discover Alumni Projects <br />
            <span className="text-gray-800">Unlock Your Learning Path</span>
          </h1>
          <p className="text-gray-600 mb-6 text-sm sm:text-base md:text-lg">
            Learn from the footsteps of those before you – explore real projects,
            gain real insights, and build your future.
          </p>
          <div className="flex justify-center md:justify-start">
           
            <Link
            to="/login"
            className="text-white font-bold bg-gradient-to-r from-[#0099cc] to-[#00b4d8] shadow-lg hover:bg-[#5EABD6] p-8 hover:text-black px-6 py-2 rounded-md "
          >
           Get started
        </Link>
          </div>
        </div>

        {/* Right Image Section */}
        <div className="transform -translate-y-4">
          <img
            src="/assets/home.jpg"
            alt="Students working"
            className="w-full h-auto rounded-lg shadow-lg object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export default Home;


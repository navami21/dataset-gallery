// import { Link, useNavigate } from "react-router-dom";
// import { FaLinkedin, FaEnvelope, FaGlobe } from "react-icons/fa";
// import "./Footer.css";

// const Footer = () => {
//   const navigate = useNavigate();

//   const token = localStorage.getItem("token");
//   const role = localStorage.getItem("role");

//   const handleNav = (path) => {
//     if (token) {
//       if (path === "/") {
//         navigate(role === "admin" ? "/admin/dashboard" : "/userdashboard");
//       } else {
//         navigate(path);
//       }
//     } else {
//       navigate(path);
//     }
//   };

//   return (
//     <footer className="animated-footer text-white py-8 mt-12">
//       <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        
//         {/* Brand */}
//         <div className="flex flex-col items-start">
//           {/* Logo */}
//           <img 
//             src="/assets/LOGO_ICTAK-ENG-Black-Text.png"
//             alt="ICTAK LearnSphere Logo" 
//             className="w-50 h-50 object-contain mb-2"
//           />
//           <h2 className="text-2xl font-bold">ICTAK LearnSphere</h2>
//           <p className="mt-2 text-gray-200 text-sm">
//             Explore curated datasets, alumni projects, and resources to enhance your learning journey.
//           </p>
//         </div>

//         {/* Quick Links */}
//         {/* Branch Addresses */}
// <div>
//   <h3 className="text-lg font-bold mb-3">Our Branches</h3>
//   <ul className="space-y-4 text-white text-sm">
//     <li>
//       <p className="font-semibold">Regional Centre (North)</p>
//       <p>ICT Academy of Kerala,<br />2nd Floor, UL Cyberpark,<br />Nellikode, Kozhikode - 673016</p>
//     </li>
//     <li>
//       <p className="font-semibold">Regional Centre (Central)</p>
//       <p>ICT Academy of Kerala,<br />1st Floor, GTECH Tower,<br />Thycaud, Thiruvananthapuram - 695014</p>
//     </li>
//     <li>
//       <p className="font-semibold">Regional Centre (South)</p>
//       <p>ICT Academy of Kerala,<br />Indira Gandhi Road,<br />Ernakulam, Kochi - 682018</p>
//     </li>
//   </ul>
// </div>

//         {/* Social Links */}
//         <div>
//           <h3 className="text-lg font-bold mb-3">Connect with Us</h3>
//           <div className="flex space-x-4">
//             <a href="https://ictkerala.org/" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white">
//               <FaGlobe size={20} />
//             </a>
//             <a href="https://www.linkedin.com/company/ictkerala/posts/?feedView=all" target="_blank" rel="noopener noreferrer" className="text-gray-200 hover:text-white">
//               <FaLinkedin size={20} />
//             </a>
//             <a href="mailto:info@ictkerala.org" className="text-gray-200 hover:text-white">
//               <FaEnvelope size={20} />
//             </a>
//           </div>
//         </div>
//       </div>

//       {/* Bottom */}
//       <div className="border-t border-gray-600 mt-6 pt-4 text-center text-gray-300 text-sm">
//         © {new Date().getFullYear()} ICTAK LearnSphere. All rights reserved.
//       </div>
//     </footer>
//   );
// };

// export default Footer;

import { Link, useNavigate } from "react-router-dom";
import { FaLinkedin, FaEnvelope, FaGlobe, FaMapMarkerAlt } from "react-icons/fa";
import "./Footer.css";

const Footer = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const handleNav = (path) => {
    if (token) {
      if (path === "/") {
        navigate(role === "admin" ? "/admin/dashboard" : "/userdashboard");
      } else {
        navigate(path);
      }
    } else {
      navigate(path);
    }
  };

  return (
    <footer className="animated-footer text-white py-8 mt-12">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Brand */}
       {/* Brand */}
<div className="flex flex-col items-start">
  <img 
    src="/assets/LOGO_ICTAK-ENG-Black-Text.png"
    alt="ICTAK LearnSphere Logo" 
    className="w-50 h-50 object-contain"
  />
  <h2 className="text-2xl font-bold">ICTAK LearnSphere</h2>

  {/* Text and Icons in same row */}
 {/* Text on the left, icons on the right */}
<div className="mt-2 w-full flex items-center justify-between">
  <p className="text-gray-200 text-sm sm:text-base">
    Explore curated datasets, alumni projects, and resources to enhance your learning journey.
  </p>

</div>

</div>


        {/* Branch Addresses in 3 columns */}
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-start space-x-2">
              <FaMapMarkerAlt className="mt-1 text-white" />
              <div>
                <p className="font-semibold">Head Quarters</p>
                <p className="text-sm">
                G1, Ground Floor, Thejaswini,<br />
                  Technopark Campus,<br />
                  Thiruvananthapuram, <br />
                  Kerala, India – 695 581
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <FaMapMarkerAlt className="mt-1 text-white" />
              <div>
                <p className="font-semibold">Regional Centre (Central)</p>
                <p className="text-sm">
                 B-Wing, Kanikonna Villa,<br />
                 Infopark Campus Koratty, Thrissur<br />
                  Kerala, India – 680 308
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <FaMapMarkerAlt className="mt-1 text-white" />
              <div>
                <p className="font-semibold">Regional Centre (North)</p>
                <p className="text-sm">
                 2nd Floor, UL Cyberpark Building,<br />
                 Nellikode Post Kozhikode,<br />
                 Kerala, India – 673 016

                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      {/* Bottom Section */}
<div className="mt-8 border-t border-gray-600 pt-4 text-center text-gray-300 text-sm">
  <p>© {new Date().getFullYear()} ICTAK LearnSphere. All rights reserved.</p>

  {/* Connect with us */}
  <div className="flex justify-center items-center space-x-4 mt-2">
    <a
      href="https://ictkerala.org/"
      target="_blank"
      rel="noopener noreferrer"
      className="text-gray-300 hover:text-white"
    >
      <FaGlobe size={20} />
    </a>
    <a
      href="https://www.linkedin.com/company/ictkerala/posts/?feedView=all"
      target="_blank"
      rel="noopener noreferrer"
      className="text-gray-200 hover:text-white"
    >
      <FaLinkedin size={20} />
    </a>
    <a
      href="mailto:info@ictkerala.org"
      className="text-gray-200 hover:text-white"
    >
      <FaEnvelope size={20} />
    </a>
  </div>
</div>

    </footer>
  );
};

export default Footer;

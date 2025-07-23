
// import React from "react";
// import { Route, Routes} from "react-router-dom";
// import Navbar from "./Components/Navbar";
// import Home from "./Components/Home";
// import AdminDashboard from "./Components/Admindashboard";
// import AdminLayout from "./Components/AdminLayout"; // new layout

// const App = () => {
//   return (
//     <Routes>
//       {/* Public Route */}
//          <Navbar />
//       {/* Admin Routes with Sidebar */}
//        <Route path="/" element={<Home />} />
//       <Route path="/admin" element={<AdminLayout />}>
//         <Route path="dashboard" element={<AdminDashboard />} />
//         {/* You can add more nested routes here */}
//       </Route>
//     </Routes>
//   );
// };

// export default App;

import React from "react";
import { Route, Routes } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Home from "./Components/Home";
import AdminDashboard from "./Components/Admindashboard";
import AdminLayout from "./Components/AdminLayout";
import UserDashboard from "./Components/Userdashboard";
import ViewDSA from "./pages/Viewdsa";
import Projects from "./pages/Projects";
import DatasetDetails from "./pages/DatasetDetails";



const App = () => {
  return (
    <>
      <Navbar /> {/* Navbar always visible */}
       
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<Home />} />

        {/* Admin Routes with layout */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
           {/* <Route path="/user" element={<userLayout />}> */}
          
          {/* Add more nested admin routes here */}
        </Route>
        <Route path="/userdashboard" element={<UserDashboard/>} />
        <Route path="/viewdsa" element={<ViewDSA />} />
         <Route path="/projects" element={<Projects />} />
          <Route path="/datasetdetails" element={<DatasetDetails />} />
      </Routes>
    </>
  );
};

export default App;

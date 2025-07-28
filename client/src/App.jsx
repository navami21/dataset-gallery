import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./Components/Home";
import AdminDashboard from "./Components/Admindashboard";
import AdminLayout from "./Components/AdminLayout";
import UserDashboard from "./Components/Userdashboard";
import ViewDSA from "./pages/Viewdsa";
import Projects from "./pages/Projects";
import DatasetDetails from "./pages/DatasetDetails";
import PrivateRoute from "./Components/PrivateRoute";
import Main from "./Components/Main";
import Login from "./Components/Login";
import ViewCategories from "./Components/CategoryView";
import AddEditCategory from "./pages/AddEditCategory";
import DatasetView from "./Components/DatasetView";
import CategoryDatasets from "./pages/CategoryDatasets";
import DatasetForm from "./pages/DatasetForm";
import Contact from "./pages/Contact";
import About from "./Components/About";

const App = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Main child={<Home />} />} />
      <Route path="/login" element={<Main child={<Login />} />} />
      <Route path="/contact" element={<Main child={<Contact />}/>} />
      <Route path="/about" element={<Main child={<About />}/>} />
      {/* Protected Routes */}
      <Route element={<PrivateRoute  allowedRoles={['admin']}/>}>
        {/* Admin layout with sidebar and outlet */}
        <Route path="/admin" element={<Main child={<AdminLayout />} />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="category" element={<ViewCategories />} />
          <Route path="/admin/category/add" element={<AddEditCategory />} />
          <Route path="/admin/category/edit/:id" element={<AddEditCategory />} />
          <Route path="category/:categoryId/datasets" element={<CategoryDatasets />} />
          <Route path="/admin/datasets" element={<DatasetView />} />
          <Route path="/admin/datasets/add" element={<DatasetForm />} />
          <Route path="/admin/datasets/edit/:datasetId" element={<DatasetForm />} />
          <Route path="datasets/:id" element={<DatasetDetails />} />

<Route path="*" element={<div>404 Not Found</div>} />




          
 </Route>
        </Route>

        {/* Other user routes */}
       <Route element={<PrivateRoute  allowedRoles={["user"]}/>}>
        <Route path="/userdashboard" element={<Main child={<UserDashboard />} />} />
        <Route path="/viewdsa" element={<Main child={<ViewDSA />} />} />
        <Route path="/projects" element={<Main child={<Projects />} />} />
        <Route path="/datasetdetails" element={<Main child={<DatasetDetails />} />} />
        
     
      </Route>
    </Routes>
  );
};

export default App;
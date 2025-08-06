import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./Components/Home";
import AdminDashboard from "./Components/Admindashboard";
import AdminLayout from "./Components/AdminLayout";
import UserDashboard from "./Components/Userdashboard";
import ViewDSA from "./pages/Viewdsa";
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
// import EngagementStats from "./Components/EngagementStats";
import EngagementPage from "./pages/EngagementPage";
import AddProjectForm from "./pages/AddProjectForm";
import ProjectDetails from "./Components/ProjectDetails";
import ProjectsByDataset from "./Components/ProjectByDataset";
import AlumniProjectsList from "./Components/AlumniProjectList";
import UserUploadPreview from "./Components/UserUploadPreview";
import ChangePassword from "./Components/ChangePassword";
import ForgotPassword from "./Components/ForgotPassword";
import ResetPassword from "./Components/ResetPassword";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminUserActivity from "./Components/AdminUserActivity";
import AdminMessages from "./Components/AdminMessages";
import UserNotifications from "./Components/UserNotifications";

const App = () => {
  return (
    <>
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Main child={<Home />} />} />
      <Route path="/login" element={<Main child={<Login />} />} />
      <Route path="/contact" element={<Main child={<Contact />}/>} />
      <Route path="/about" element={<Main child={<About />}/>} />
      <Route path="/forgot-password" element={<Main child={<ForgotPassword />} />} />
            <Route path="/reset-password/:token" element={<Main child={<ResetPassword />} />} />



      {/* Protected Routes */}
      


      <Route element={<PrivateRoute  allowedRoles={['admin']}/>}>
        <Route path="/admin" element={<Main child={<AdminLayout />} />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="category" element={<ViewCategories />} />
          <Route path="category/add" element={<AddEditCategory />} />
          <Route path="category/edit/:id" element={<AddEditCategory />} />
=
          {/* <Route path="category/:categoryId/datasets" element={<CategoryDatasets />} /> */}
          <Route path="datasets" element={<DatasetView />} />
          <Route path="datasets/add" element={<DatasetForm />} />
          <Route path="datasets/edit/:datasetId" element={<DatasetForm />} />
          <Route path="datasets/:id" element={<DatasetDetails />} />
          <Route path="projects" element={<AlumniProjectsList />} />
          <Route path="projects/add" element={<AddProjectForm />} />
          <Route path="datasets/:datasetId/projects" element={<Main child={<ProjectsByDataset />} />} />
          <Route path="edit-project/:id" element={<AddProjectForm />} />
          <Route path="users/add" element={<UserUploadPreview/>} />
          <Route path="messages" element={<AdminMessages/>} />
          <Route path="/admin/user-activity" element={<AdminUserActivity />} />



          <Route path="*" element={<div>404 Not Found</div>} /> 
          <Route path="/admin/engagement/:type/:id" element={<EngagementPage />} />          
         </Route>
        </Route>

        <Route element={<PrivateRoute allowedRoles={['user', 'admin']} />}>
        <Route path="/projects/:id" element={<Main child={<ProjectDetails />} />} />
        <Route path="/projects/datasets/:id" element={<ProjectDetails />} />
       <Route path="/datasets/:datasetId/projects" element={<Main child={<ProjectsByDataset />} />} />
       <Route path="/change-password" element={<Main child={<ChangePassword />} />} />
        <Route path="/category/:categoryId/datasets" element={<Main child={<CategoryDatasets />} />} />
        <Route path="/dataset/details/:id" element={<DatasetDetails />} />
        </Route>

        {/* Other user routes */}
       <Route element={<PrivateRoute  allowedRoles={["user"]}/>}>
        <Route path="/userdashboard" element={<Main child={<UserDashboard />} />} />
        <Route path="/viewdsa" element={<Main child={<ViewDSA />} />} />
        <Route path="/datasetdetails" element={<Main child={<DatasetDetails />} />} />
          <Route path="/notifications" element={<Main child={<UserNotifications />} />} />

        {/* <Route path="/category/:id" element={<Main child={<DatasetView />} />} /> */}
        {/* <Route path="/category/:categoryId/datasets" element={<CategoryDatasets />} /> */}

        {/* <Route path="/category/:id" element={<DatasetView />} /> */}
     
      </Route>
      
    </Routes>
      <ToastContainer position="top-center" autoClose={3000} />

    </>
    
  );
};

export default App;

// import React, { useEffect, useState } from "react";
// import axiosInstance from "../axiosinterceptor";
// import { useNavigate, useParams } from "react-router-dom";
// import { FiImage, FiFileText } from "react-icons/fi";

// const AddProjectForm = () => {
//   const navigate = useNavigate();
//   const { id: projectId } = useParams();

//   const [loading, setLoading] = useState(false);
//   const [categories, setCategories] = useState([]);
//   const [datasets, setDatasets] = useState([]);
//   const [filteredDatasets, setFilteredDatasets] = useState([]);
//   const [isEditMode, setIsEditMode] = useState(false);

//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",
//     link: "",
//     category: "",
//     dataset: "",
//     image: null,
//     report: null,
//   });

//  const filterDatasetsByCategory = (categoryId) => {
//   if (!categoryId) {
//     setFilteredDatasets([]);
//     return;
//   }

//   const filtered = datasets.filter(ds => {
//     // Handles both string and object form
//     return ds.category === categoryId || ds.category?._id === categoryId;
//   });

//   setFilteredDatasets(filtered);
// };


//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [categoryRes, datasetRes] = await Promise.all([
//           axiosInstance.get("/category/all"),
//           axiosInstance.get("/datasets"),
          

//         ]);
//         setCategories(categoryRes.data);
//         setDatasets(datasetRes.data);
//         console.log("Datasets:", datasetRes.data)


//         if (projectId) {
//           setLoading(true);
//           const res = await axiosInstance.get(`/projects/${projectId}`);
//           const project = res.data.project;

//           setFormData({
//             title: project.title,
//             description: project.description,
//             link: project.link,
//             category: project.category || "",
//             dataset: project.dataset?._id || "",
//             image: null,
//             report: null,
//           });

//           setIsEditMode(true);
//           filterDatasetsByCategory(project.category || "");
//           setLoading(false);
//           console.log("Filtered Datasets:", filtered);

//         }
//       } catch (err) {
//         console.error("Error fetching data:", err);
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [projectId]);

//  const handleChange = (e) => {
//   const { name, value, files } = e.target;

//   if (name === "image") {
//     setFormData((prev) => ({
//       ...prev,
//       image: prev.image
//         ? [...Array.from(prev.image), ...Array.from(files)]
//         : Array.from(files),
//     }));
//   } else if (name === "report") {
//     setFormData({ ...formData, report: files[0] });
//   } else if (name === "category") {
//     setFormData({ ...formData, category: value, dataset: "" });
//     filterDatasetsByCategory(value);
//   } else {
//     setFormData({ ...formData, [name]: value });
//   }
// };


//   // const handleSubmit = async (e) => {
//   //   e.preventDefault();
//   //   const form = new FormData();

//   //   if (formData.image) {
//   //     Array.from(formData.image).forEach(file => form.append("image", file));
//   //   }

//   //   if (formData.report) {
//   //     form.append("report", formData.report);
//   //   }

//   //   for (const key in formData) {
//   //     if (key !== "image" && key !== "report" && formData[key]) {
//   //       form.append(key, formData[key]);
//   //     }
//   //   }

//   //   try {
//   //     const response = await axiosInstance.post("/projects/add", form);
//   //     console.log("Uploaded successfully", response.data);
//   //     navigate("/admin/projects"); // Redirect after success (optional)
//   //   } catch (error) {
//   //     console.error("Upload failed", error);
//   //   }
//   // };
// const handleSubmit = async (e) => {
//   e.preventDefault();
//   const form = new FormData();

//   if (formData.image) {
//     Array.from(formData.image).forEach(file => form.append("image", file));
//   }

//   if (formData.report) {
//     form.append("report", formData.report);
//   }

//   for (const key in formData) {
//     if (key !== "image" && key !== "report" && formData[key]) {
//       form.append(key, formData[key]);
//     }
//   }

//   try {
//     let response;
//     if (isEditMode) {
//       response = await axiosInstance.put(`/projects/${projectId}`, form, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       });
//     } else {
//       response = await axiosInstance.post("/projects/add", form, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       });
//     }

//     console.log("Success:", response.data);
//     navigate("/admin/projects");
//   } catch (error) {
//     console.error("Submission failed:", error);
//   }
// };

//   if (loading) {
//     return <div className="text-center py-10">Loading project...</div>;
//   }

//   return (
//     <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-md">
//       <h2 className="text-2xl font-semibold mb-4">
//         {isEditMode ? "Edit Project" : "Add Alumni Project"}
//       </h2>

//       <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
//        <div className="md:col-span-1">
//         <label className="block font-medium mb-1">Project Title</label>
//         <input
//           type="text"
//           name="title"
//           required
//           value={formData.title}
//           onChange={handleChange}
//           className="w-full border px-3 py-2 rounded"
//         />
//         </div>

//           <div className="md:col-span-1">
//             <label className="block font-medium mb-1">Project Link</label>
//             <input
//               type="url"
//               name="link"
//               value={formData.link}
//               onChange={handleChange}
//               className="w-full border px-3 py-2 rounded"
//             />
//           </div>

//         <div className="md:col-span-2">
//           <label className="block font-medium mb-1">Description</label>
//           <textarea
//             name="description"
//             required
//             rows={4}
//             value={formData.description}
//             onChange={handleChange}
//             className="w-full border px-3 py-2 rounded"
//           />
//         </div>
// <div className="md:col-span-1">
//   <label className="block font-medium mb-1">Select Category</label>
//   <select
//     name="category"
//     required
//     value={formData.category}
//     onChange={handleChange}
//     className="w-full border px-3 py-2 rounded"
//   >
//     <option value="">-- Choose Category --</option>
//     {categories.map(cat => (
//       <option key={cat._id} value={cat._id}>
//         {cat.name}
//       </option>
//     ))}
//   </select>
// </div>

// <div className="md:col-span-1">
//   <label className="block font-medium mb-1">Select Dataset</label>
//   <select
//     name="dataset"
//     required
//     value={formData.dataset}
//     onChange={handleChange}
//     className="w-full border px-3 py-2 rounded"
//     disabled={filteredDatasets.length === 0}
//   >
//     <option value="">-- {filteredDatasets.length > 0 ? "Choose Dataset" : "No datasets available"} --</option>
//     {filteredDatasets.map(ds => (
//       <option key={ds._id} value={ds._id}>
//         {ds.title}
//       </option>
//     ))}
//   </select>
// </div>


//         <div className="md:col-span-1 mb-2">
//   <label className="block font-medium mb-1">Upload Image(s)</label>
//   <label className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 border border-green-300 rounded cursor-pointer hover:bg-green-200 w-max">
//     <FiImage />
//     Choose Image(s)
//     <input
//       type="file"
//       name="image"
//       accept=".png,.jpg,.jpeg"
//       multiple
//       onChange={handleChange}
//       className="hidden"
//     />
//   </label>
//   {formData.image ? (
//     <div className="mt-2 text-sm text-gray-700">
//       {Array.from(formData.image).map((file, i) => (
//         <p key={i}>{file.name}</p>
//       ))}
//     </div>
//   ) : isEditMode && (
//     <p className="text-sm text-gray-500 mt-1">Image(s) already uploaded</p>
//   )}
// </div>

// <div className="md:col-span-1 mb-2">
//   <label className="block font-medium mb-1">Upload Report (PDF)</label>
//   <label className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 border border-blue-300 rounded cursor-pointer hover:bg-blue-200 w-max">
//     <FiFileText />
//     Choose Report
//     <input
//       type="file"
//       name="report"
//       accept=".pdf"
//       onChange={handleChange}
//       className="hidden"
//     />
//   </label>
//   {formData.report ? (
//     <p className="text-sm text-gray-700 mt-2">{formData.report.name}</p>
//   ) : isEditMode && (
//     <p className="text-sm text-gray-500 mt-2">Report already uploaded</p>
//   )}
// </div>


//         <div className="md:col-span-2 text-right">
//         <button
//           type="submit"
//           className="w-full md:w-auto p-4 bg-[#0099cc] hover:bg-[#007aab] text-white font-semibold py-2.5 rounded-lg transition duration-300"
//         >
//           {isEditMode ? "Update" : "Add Project"}
//         </button>
//       </div>

//       </form>
//     </div>
//   );
// };

// export default AddProjectForm;

import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosinterceptor";
import { useNavigate, useParams } from "react-router-dom";
import { FiImage, FiFileText } from "react-icons/fi";

const AddProjectForm = () => {
  const navigate = useNavigate();
  const { id: projectId } = useParams();

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [datasets, setDatasets] = useState([]);
  const [filteredDatasets, setFilteredDatasets] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [existingImages, setExistingImages] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    link: "",
    category: "",
    dataset: "",
    image: null,
    report: null,
  });

  const filterDatasetsByCategory = (categoryId) => {
    if (!categoryId) {
      setFilteredDatasets([]);
      return;
    }
    const filtered = datasets.filter(
      (ds) => ds.category === categoryId || ds.category?._id === categoryId
    );
    setFilteredDatasets(filtered);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoryRes, datasetRes] = await Promise.all([
          axiosInstance.get("/category/all"),
          axiosInstance.get("/datasets"),
        ]);

        setCategories(categoryRes.data);
        setDatasets(datasetRes.data);

        if (projectId) {
          setLoading(true);
          const res = await axiosInstance.get(`/projects/${projectId}`);
          const project = res.data.project;

          setFormData({
            title: project.title,
            description: project.description,
            link: project.link,
            category: project.category || "",
            dataset: project.dataset?._id || "",
            image: null,
            report: null,
          });

          setExistingImages(project.image || []); // Store existing image URLs
          setIsEditMode(true);
          filterDatasetsByCategory(project.category || "");
          setLoading(false);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setLoading(false);
      }
    };

    fetchData();
  }, [projectId]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      setFormData((prev) => ({
        ...prev,
        image: prev.image
          ? [...Array.from(prev.image), ...Array.from(files)]
          : Array.from(files),
      }));
    } else if (name === "report") {
      setFormData({ ...formData, report: files[0] });
    } else if (name === "category") {
      setFormData({ ...formData, category: value, dataset: "" });
      filterDatasetsByCategory(value);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();

    if (formData.image) {
      Array.from(formData.image).forEach((file) => form.append("image", file));
    }

    if (formData.report) {
      form.append("report", formData.report);
    }

    for (const key in formData) {
      if (key !== "image" && key !== "report" && formData[key]) {
        form.append(key, formData[key]);
      }
    }

    try {
      let response;
      if (isEditMode) {
        response = await axiosInstance.put(`/projects/${projectId}`, form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        response = await axiosInstance.post("/projects/add", form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      console.log("Success:", response.data);
      navigate("/admin/projects");
    } catch (error) {
      console.error("Submission failed:", error);
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading project...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-semibold mb-4">
        {isEditMode ? "Edit Project" : "Add Alumni Project"}
      </h2>

      <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="block font-medium mb-1">Project Title</label>
          <input
            type="text"
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Project Link</label>
          <input
            type="url"
            name="link"
            value={formData.link}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block font-medium mb-1">Description</label>
          <textarea
            name="description"
            required
            rows={4}
            value={formData.description}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Select Category</label>
          <select
            name="category"
            required
            value={formData.category}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">-- Choose Category --</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">Select Dataset</label>
          <select
            name="dataset"
            required
            value={formData.dataset}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            disabled={filteredDatasets.length === 0}
          >
            <option value="">
              --{" "}
              {filteredDatasets.length > 0
                ? "Choose Dataset"
                : "No datasets available"}{" "}
              --
            </option>
            {filteredDatasets.map((ds) => (
              <option key={ds._id} value={ds._id}>
                {ds.title}
              </option>
            ))}
          </select>
        </div>

        {/* Upload New Images */}
        <div>
          <label className="block font-medium mb-1">Upload Image(s)</label>
          <label className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 border border-green-300 rounded cursor-pointer hover:bg-green-200 w-max">
            <FiImage />
            Choose Image(s)
            <input
              type="file"
              name="image"
              accept=".png,.jpg,.jpeg"
              multiple
              onChange={handleChange}
              className="hidden"
            />
          </label>

          {formData.image && (
            <div className="mt-2 text-sm text-gray-700">
              {Array.from(formData.image).map((file, i) => (
                <p key={i}>{file.name}</p>
              ))}
            </div>
          )}

          {isEditMode && existingImages.length > 0 && (
            <div className="mt-3 grid grid-cols-2 gap-2">
              {existingImages.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`Uploaded ${i + 1}`}
                  className="w-full h-32 object-cover rounded"
                />
              ))}
            </div>
          )}
        </div>

        {/* Upload Report */}
        <div>
          <label className="block font-medium mb-1">Upload Report (PDF)</label>
          <label className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 border border-blue-300 rounded cursor-pointer hover:bg-blue-200 w-max">
            <FiFileText />
            Choose Report
            <input
              type="file"
              name="report"
              accept=".pdf"
              onChange={handleChange}
              className="hidden"
            />
          </label>

          {formData.report ? (
            <p className="text-sm text-gray-700 mt-2">
              {formData.report.name}
            </p>
          ) : (
            isEditMode && <p className="text-sm text-gray-500 mt-2">Report already uploaded</p>
          )}
        </div>

       <div className="md:col-span-2 flex flex-col md:flex-row gap-3 justify-end">
  <button
    type="button"
    onClick={() => navigate("/admin/projects")}
    className="w-full md:w-auto px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded-lg transition duration-300"
  >
    Cancel
  </button>

  <button
    type="submit"
    className="w-full md:w-auto px-4 py-2 bg-[#0099cc] hover:bg-[#007aab] text-white font-semibold rounded-lg transition duration-300"
  >
    {isEditMode ? "Update" : "Add Project"}
  </button>
</div>

      </form>
    </div>
  );
};

export default AddProjectForm;

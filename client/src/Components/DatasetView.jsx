

// import { useEffect, useState } from "react";
// import { useLocation, Link } from "react-router-dom";
// import axiosInstance from "../axiosinterceptor";
// import { FaEdit, FaTrash } from "react-icons/fa";

// const DatasetView = () => {
//   const [datasets, setDatasets] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const location = useLocation();
//   const params = new URLSearchParams(location.search);
//   const categoryId = params.get("category");

//   const userRole = localStorage.getItem("role");

//   const fetchDatasets = async () => {
//     try {
//       const token = localStorage.getItem("logintoken");
//       let url = "/datasets";
//       if (categoryId) {
//         url += `?category=${categoryId}`;
//       }

//       const response = await axiosInstance.get(url, {
//         headers: { token },
//       });
//       setDatasets(response.data);
//     } catch (error) {
//       console.error("Error fetching datasets:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this dataset?")) return;
//     try {
//       const token = localStorage.getItem("logintoken");
//       await axiosInstance.delete(`/datasets/${id}`, {
//         headers: { token },
//       });
//       setDatasets((prev) => prev.filter((ds) => ds._id !== id));
//     } catch (error) {
//       console.error("Delete error:", error);
//     }
//   };

//   useEffect(() => {
//     fetchDatasets();
//   }, [categoryId]);

//   if (loading) {
//     return <div className="text-center text-lg mt-10">Loading datasets...</div>;
//   }

//   return (
//     <div className="p-4 md:p-8">
//       <h2 className="text-2xl font-bold text-center mb-6">Available Datasets</h2>
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//         {datasets.map((dataset) => (
//           <div
//             key={dataset._id}
//             className="bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-1"
//           >
//             <img
//               src={`http://localhost:3000${dataset.imageUrl}`}
//               alt="dataset"
//               className="w-full h-40 object-cover rounded-t-xl"
//             />
//             <div className="p-4">
//               {/* Category Tag */}
//               {dataset.category?.name && (
//                 <span className="inline-block bg-[#0099cc] text-white text-xs font-semibold px-3 py-1 rounded-full mb-2">
//                   {dataset.category.name}
//                 </span>
//               )}

//               <h3 className="text-lg font-semibold text-center mb-2">
//                 {dataset.title}
//               </h3>

//               {/* File info */}
//               <div className="text-sm text-center text-gray-600">
//                 <span className="font-bold !text-[#0099cc]">
//                   {dataset.fileType ||
//                     dataset.fileName?.split(".").pop()?.toUpperCase() ||
//                     "CSV"}
//                 </span>
//                 {" "} | &nbsp;
//                 {dataset.size || "N/A"} &nbsp; | &nbsp;
//                 {dataset.columnCount || 0} Columns
//               </div>

//               {/* Actions */}
//               <div className="mt-4 flex justify-center gap-3">
//                 <Link
//                   to={`/admin/datasets/${dataset._id}`}
//                   className="bg-[#0099cc] font-semibold text-white px-4 py-2 rounded hover:bg-[#00809D] transition"
//                 >
//                   View
//                 </Link>
//                 {userRole === "admin" && (
//                   <>
//                     <Link
//                       to={`/admin/datasets/edit/${dataset._id}`}
//                       className="text-green-700 hover:text-green-900 py-2 transition text-xl"
//                       title="Edit"
//                     >
//                       <FaEdit />
//                     </Link>
//                     <button
//                       onClick={() => handleDelete(dataset._id)}
//                       className="text-red-500 hover:text-red-700 transition"
//                       title="Delete"
//                     >
//                       <FaTrash />
//                     </button>
//                   </>
//                 )}
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default DatasetView;

import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import axiosInstance from "../axiosinterceptor";
import { FaEdit, FaTrash, FaSearch } from "react-icons/fa";

const DatasetView = () => {
  const [datasets, setDatasets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const categoryId = params.get("category");

  const userRole = localStorage.getItem("role");

  const fetchDatasets = async () => {
    try {
      const token = localStorage.getItem("logintoken");
      let url = "/datasets";
      if (categoryId) {
        url += `?category=${categoryId}`;
      }

      const response = await axiosInstance.get(url, {
        headers: { token },
      });
      setDatasets(response.data);
    } catch (error) {
      console.error("Error fetching datasets:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this dataset?")) return;
    try {
      const token = localStorage.getItem("logintoken");
      await axiosInstance.delete(`/datasets/${id}`, {
        headers: { token },
      });
      setDatasets((prev) => prev.filter((ds) => ds._id !== id));
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  useEffect(() => {
    fetchDatasets();
  }, [categoryId]);

  if (loading) {
    return <div className="text-center text-lg mt-10">Loading datasets...</div>;
  }

  // Filter datasets based on search term
  const filteredDatasets = datasets.filter(
    (dataset) =>
      dataset.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dataset.category?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 md:p-8">
      <h2 className="text-2xl font-bold text-center mb-6">Available Datasets</h2>

      {/* Search Bar */}
      <div className="relative max-w-md mx-auto mb-8">
        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search datasets..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0099cc]"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDatasets.length > 0 ? (
          filteredDatasets.map((dataset) => (
            <div
              key={dataset._id}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-1"
            >
              <img
                src={`http://localhost:3000${dataset.imageUrl}`}
                alt="dataset"
                className="w-full h-40 object-cover rounded-t-xl"
              />
              <div className="p-4">
                {/* Category Tag */}
                {dataset.category?.name && (
                  <span className="inline-block bg-[#0099cc] text-white text-xs font-semibold px-3 py-1 rounded-full mb-2">
                    {dataset.category.name}
                  </span>
                )}

                <h3 className="text-lg font-semibold text-center mb-2">
                  {dataset.title}
                </h3>

                {/* File info */}
                <div className="text-sm text-center text-gray-600">
                  <span className="font-bold !text-[#0099cc]">
                    {dataset.fileType ||
                      dataset.fileName?.split(".").pop()?.toUpperCase() ||
                      "CSV"}
                  </span>{" "}
                  | &nbsp;
                  {dataset.size || "N/A"} &nbsp; | &nbsp;
                  {dataset.columnCount || 0} Columns
                </div>

                {/* Actions */}
                <div className="mt-4 flex justify-center gap-3">
                  <Link
                    to={`/admin/datasets/${dataset._id}`}
                    className="bg-[#0099cc] font-semibold text-white px-4 py-2 rounded hover:bg-[#00809D] transition"
                  >
                    View
                  </Link>
                  {userRole === "admin" && (
                    <>
                      <Link
                        to={`/admin/datasets/edit/${dataset._id}`}
                        className="text-green-700 hover:text-green-900 py-2 transition text-xl"
                        title="Edit"
                      >
                        <FaEdit />
                      </Link>
                      <button
                        onClick={() => handleDelete(dataset._id)}
                        className="text-red-500 hover:text-red-700 transition"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">
            No datasets found.
          </p>
        )}
      </div>
    </div>
  );
};

export default DatasetView;

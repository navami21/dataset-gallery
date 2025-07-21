// import React from "react";

// const datasets = [
//   {
//     id: 1,
//     title: "Real Estate Data South Carolina",
//     subtitle: "Real Estate Dataset 2025",
//     fileType: "CSV",
//     size: "56kb",
//     columns: 14,
//     image: "/assets/south-carolina.png",
//   },
//   {
//     id: 2,
//     title: "Cryptocurrency Market Sentiment & Price Data 2025",
//     subtitle: "Cryptocurrency",
//     fileType: "CSV",
//     size: "64kb",
//     columns: 20,
//     image: "/assets/crypto.jpg",
//   },
// ];

// const ViewDSA = () => {
//   return (
//     <div className="min-h-screen px-4 md:px-10 py-8 bg-white">
//       <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">DSA</h1>

//       <div className="flex justify-center mb-8">
//         <input
//           type="text"
//           placeholder="🔍 Search datasets"
//           className="w-full max-w-md px-4 py-2 rounded-full border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
//         />
//       </div>

//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 place-items-center">
//         {datasets.map((data) => (
//           <div
//             key={data.id}
//             className="w-full max-w-xs bg-white shadow-lg rounded-xl overflow-hidden transition-transform transform hover:scale-105"
//           >
//             <img
//               src={data.image}
//               alt={data.title}
//               className="w-full h-40 object-cover"
//             />
//             <div className="p-4">
//               <h3 className="text-md font-semibold text-gray-800 leading-snug">
//                 {data.title}
//               </h3>
//               <p className="text-sm text-gray-500">{data.subtitle}</p>
//               <div className="text-sm text-gray-600 mt-2 space-y-1">
//                 <p>
//                   1 File({data.fileType}) <span className="ml-2">({data.size})</span>
//                 </p>
//                 <p>{data.columns} Columns</p>
//               </div>
//               <div className="mt-4">
//                 <button className="w-full bg-gray-100 hover:bg-gray-200 text-black font-medium py-1.5 rounded-md shadow-sm">
//                   View
//                 </button>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ViewDSA;

// import React from "react";

// const datasets = [
//   {
//     id: 1,
//     title: "Real Estate Data South Carolina",
//     subtitle: "Real Estate Dataset 2025",
//     fileType: "CSV",
//     size: "56kb",
//     columns: 14,
//     image: "/assets/south-carolina.png",
//   },
//   {
//     id: 2,
//     title: "Cryptocurrency Market Sentiment & Price Data 2025",
//     subtitle: "Cryptocurrency",
//     fileType: "CSV",
//     size: "64kb",
//     columns: 20,
//     image: "/assets/crypto.jpg",
//   },
// ];

// const ViewDSA = () => {
//   return (
//     <div className="min-h-screen px-4 md:px-10 py-8 bg-white">
//       <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">DSA</h1>

//       <div className="flex justify-center mb-8">
//         <input
//           type="text"
//           placeholder="🔍 Search datasets"
//           className="w-full max-w-md px-4 py-2 rounded-full border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
//         />
//       </div>

//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//         {datasets.map((data) => (
//           <div
//             key={data.id}
//             className="flex flex-col h-full bg-white shadow-md rounded-xl overflow-hidden transition-transform transform hover:scale-105"
//           >
//             <div className="h-48 w-full overflow-hidden">
//               <img
//                 src={data.image}
//                 alt={data.title}
//                 className="w-full h-full object-cover object-center"
//               />
//             </div>
//             <div className="flex flex-col justify-between flex-1 p-4">
//               <div>
//                 <h3 className="text-md font-semibold text-gray-800 leading-snug mb-1">
//                   {data.title}
//                 </h3>
//                 <p className="text-sm text-gray-500">{data.subtitle}</p>
//                 <div className="text-sm text-gray-600 mt-2 space-y-1">
//                   <p>
//                     1 File({data.fileType}){" "}
//                     <span className="ml-2">({data.size})</span>
//                   </p>
//                   <p>{data.columns} Columns</p>
//                 </div>
//               </div>
//               <div className="mt-4">
//                 <button className="w-full bg-gray-100 hover:bg-gray-200 text-black font-medium py-2 rounded-md shadow-sm">
//                   View
//                 </button>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ViewDSA;

import React from "react";

const datasets = [
  {
    id: 1,
    title: "Real Estate Data South Carolina",
    subtitle: "Real Estate Dataset 2025",
    fileType: "CSV",
    size: "56kb",
    columns: 14,
    image: "/assets/south-carolina.png",
  },
  {
    id: 2,
    title: "Cryptocurrency Market Sentiment & Price Data 2025",
    subtitle: "Cryptocurrency",
    fileType: "CSV",
    size: "64kb",
    columns: 20,
    image: "/assets/crypto.jpg",
  },
];

const ViewDSA = () => {
  return (
    <div className="min-h-screen px-4 md:px-10 py-8 bg-white">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">DSA</h1>

      <div className="flex justify-center mb-8">
        <input
          type="text"
          placeholder="🔍 Search datasets"
          className="w-full max-w-md px-4 py-2 rounded-full border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 place-items-center">
        {datasets.map((data) => (
          <div
            key={data.id}
            className="w-full max-w-xs flex flex-col bg-white shadow-lg rounded-xl overflow-hidden transition-transform transform hover:scale-105"
          >
            <div className="h-40 w-full overflow-hidden">
              <img
                src={data.image}
                alt={data.title}
                className="w-full h-full object-cover object-center"
              />
            </div>
            <div className="flex flex-col justify-between flex-grow p-4">
              <div>
                <h3 className="text-md font-semibold text-gray-800 leading-snug">
                  {data.title}
                </h3>
                <p className="text-sm text-gray-500">{data.subtitle}</p>
                <div className="text-sm text-gray-600 mt-2 space-y-1">
                  <p>
                    1 File ({data.fileType}) <span className="ml-2">({data.size})</span>
                  </p>
                  <p>{data.columns} Columns</p>
                </div>
              </div>
              <div className="mt-4">
                <button className="w-full bg-gray-100 hover:bg-gray-200 text-black font-medium py-1.5 rounded-md shadow-sm">
                  View
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewDSA;

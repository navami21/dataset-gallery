// import React from 'react';

// const UserDashboard = () => {
//   return (
//     <div className="bg-white min-h-screen px-6 py-4">
//       {/* Banner */}
//       <div className="mt-4 rounded-lg overflow-hidden">
//         <img
//           src="/assets/image.png" // replace with your actual image
//           alt="Banner"
//           className="w-full h-[250px] object-cover rounded-lg"
//         />
//         {/* <div className="text-center -mt-24 relative z-10 text-white font-semibold text-xl sm:text-2xl md:text-3xl">
//           <p className="bg-black bg-opacity-50 inline-block px-4 py-2 rounded-lg">
//             Learn from the path taken. <br /> Explore. Build your future.
//           </p>
//         </div> */}
//       </div>

//       {/* Discover - Practice - Grow Cards */}
//       <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
//         <div className="border p-6 rounded-md shadow-sm hover:shadow-lg transition">
//           <img src="https://img.icons8.com/ios/50/search--v1.png" alt="Discover" className="mx-auto mb-3" />
//           <p className="font-medium">Discover</p>
//         </div>
//         <div className="border p-6 rounded-md shadow-sm hover:shadow-lg transition">
//           <img src="https://img.icons8.com/ios/50/maintenance--v1.png" alt="Practice" className="mx-auto mb-3" />
//           <p className="font-medium">Practice</p>
//         </div>
//         <div className="border p-6 rounded-md shadow-sm hover:shadow-lg transition">
//           <img src="https://img.icons8.com/ios/50/combo-chart--v1.png" alt="Grow" className="mx-auto mb-3" />
//           <p className="font-medium">Grow</p>
//         </div>
//       </div>

//       {/* Explore Categories Section */}
//       <div className="mt-12 text-center">
//         <h2 className="text-lg md:text-xl font-semibold mb-6">Explore Categories</h2>
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-center">
//           {/* DSA Card */}
//           <div className="rounded-md shadow-md p-4 border hover:shadow-xl transition">
//             <img
//               src="https://miro.medium.com/v2/resize:fit:828/format:webp/1*UeB8hZom7rldT4zD9sC1Zw.png"
//               alt="DSA"
//               className="w-full h-40 object-cover rounded"
//             />
//             <p className="text-lg font-semibold mt-4">DSA</p>
//             <button className="mt-2 bg-sky-500 text-white px-4 py-2 rounded hover:bg-sky-600">
//               View
//             </button>
//           </div>

//           {/* AI/ML Card */}
//           <div className="rounded-md shadow-md p-4 border hover:shadow-xl transition">
//             <img
//               src="https://miro.medium.com/v2/resize:fit:828/format:webp/1*V4hZXxSnOkRHo6MAF1Kh0g.jpeg"
//               alt="AI/ML"
//               className="w-full h-40 object-cover rounded"
//             />
//             <p className="text-lg font-semibold mt-4">AI/ML</p>
//             <button className="mt-2 bg-sky-500 text-white px-4 py-2 rounded hover:bg-sky-600">
//               View
//             </button>
//           </div>

//           {/* Deep Learning Card */}
//           <div className="rounded-md shadow-md p-4 border hover:shadow-xl transition">
//             <img
//               src="https://miro.medium.com/v2/resize:fit:828/format:webp/1*bkN6-O3Wl9B5kpJgX8vDUw.png"
//               alt="Deep Learning"
//               className="w-full h-40 object-cover rounded"
//             />
//             <p className="text-lg font-semibold mt-4">Deep Learning</p>
//             <button className="mt-2 bg-sky-500 text-white px-4 py-2 rounded hover:bg-sky-600">
//               View
//             </button>
//           </div>
//         </div>

//         {/* Dots below cards (carousel-like) */}
//         <div className="flex justify-center mt-4 gap-2">
//           <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
//           <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
//           <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserDashboard;


import React from 'react';

const UserDashboard = () => {
  return (
    <div className="bg-white min-h-screen px-4 sm:px-6 py-6">
      {/* Banner */}
      <div className="relative rounded-lg overflow-hidden max-w-screen-xl mx-auto">
        <img
          src="/assets/image.png"
          alt="Banner"
        //   className="w-full h-[220px] sm:h-[300px] md:h-[350px] object-cover rounded-lg"
        className="w-full h-auto max-h-[500px] object-cover rounded-lg shadow-md"
        />
        {/* <div className="absolute inset-0 flex items-center justify-center">
          <p className="bg-black bg-opacity-50 text-white text-center px-4 py-3 sm:px-6 sm:py-4 rounded text-lg sm:text-2xl font-semibold">
            Learn from the path taken. <br /> Explore. Build your future.
          </p>
        </div> */}
      </div>

      {/* Discover - Practice - Grow Cards */}
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-screen-xl mx-auto">
        {[
          { title: 'Discover', icon: 'https://img.icons8.com/ios/50/search--v1.png' },
          { title: 'Practice', icon: 'https://img.icons8.com/ios/50/maintenance--v1.png' },
          { title: 'Grow', icon: 'https://img.icons8.com/ios/50/combo-chart--v1.png' },
        ].map((item, index) => (
          <div
            key={index}
            className="border p-6 rounded-md shadow-sm hover:shadow-lg transition text-center"
          >
            <img src={item.icon} alt={item.title} className="mx-auto mb-4 h-12 w-12" />
            <p className="font-medium text-lg">{item.title}</p>
          </div>
        ))}
      </div>

      {/* Explore Categories Section */}
      <div className="mt-16 text-center max-w-screen-xl mx-auto">
        <h2 className="text-xl md:text-2xl font-semibold mb-8">Explore Categories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {/* Category Cards */}
          {[
            {
              title: 'DSA',
              image:
                'assets/dsa.jpg',
            },
            {
              title: 'AI/ML',
              image:
                'assets/aiml.png',
            },
            {
              title: 'Deep Learning',
              image:
                'assets/deeplearning.jpg',
            },
          ].map((card, index) => (
            <div
              key={index}
              className="rounded-md shadow-md p-4 border hover:shadow-xl transition flex flex-col"
            >
              <img
                src={card.image}
                alt={card.title}
                className="w-full h-40 object-cover rounded"
              />
              <p className="text-lg font-semibold mt-4">{card.title}</p>
              <button className="mt-3 bg-sky-500 text-white px-4 py-2 rounded hover:bg-sky-600">
                View
              </button>
            </div>
          ))}
        </div>

        {/* Dots (Carousel-like) */}
        <div className="flex justify-center mt-6 gap-2">
          <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
          <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
          <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;

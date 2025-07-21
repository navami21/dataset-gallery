import React from "react";
import { FaFileAlt, FaColumns } from "react-icons/fa";

const DatasetDetails = () => {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 md:px-12">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-md p-6 md:p-10">
        <h2 className="text-xl md:text-2xl font-semibold text-center text-gray-800 mb-8">
          Real Estate Data South Carolina
        </h2>

        <div className="flex flex-col md:flex-row justify-center items-center md:items-start gap-8">
          {/* Image */}
          <img
            src="/assets/south-carolina.png"
            alt="South Carolina Dataset"
            className="rounded-lg w-[320px] h-[180px] object-cover"
          />

          {/* Right Info */}
          <div className="space-y-6 text-sm text-gray-700">
            <div>
              <h4 className="font-semibold text-base">Dataset Overview</h4>
              <p className="mt-1">
                This comprehensive real estate dataset contains over 5,000
                property listings from South Carolina, collected in 2025 from Realtor.com using an API.
              </p>
              <p className="mt-2">
                It captures diverse property types like single-family homes, condos, land parcels, and townhomes.
              </p>
              <p className="mt-2">
                Ideal for predictive modeling, market analysis, and investment research.
              </p>
            </div>

            <button className="px-4 py-2 rounded bg-sky-500 text-white hover:bg-sky-600 shadow">
              View Projects
            </button>
          </div>

          {/* Summary */}
          <div className="w-full md:w-40 mt-4 md:mt-0 text-center">
            <h5 className="font-semibold mb-4 border-b pb-2">Summary</h5>
            <div className="flex flex-col items-center text-gray-600 space-y-4">
              <div className="flex items-center space-x-2">
                <FaFileAlt />
                <span>1 File</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaColumns />
                <span>14 Columns</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatasetDetails;

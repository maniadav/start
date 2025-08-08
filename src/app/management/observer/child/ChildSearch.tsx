import React from "react";

const ChildSearch = ({ handleDataFetch }: any) => {
  return (
    <div className="w-full mt-5">
      <h3 className="text-md font-semibold text-gray-700 mb-3">
        Do you have the Star ID? Fetch details from server
      </h3>
      <div className="flex gap-2">
        <input
          className="flex-1 px-4 py-2 rounded-lg font-medium bg-white border border-gray-300 placeholder-gray-500 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          type="text"
          placeholder="Enter Child ID"
          id="fetchChildID"
          name="fetchChildID"
        />
        <button
          type="button"
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition duration-200"
          onClick={() => handleDataFetch()}
        >
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            Fetch Details
          </div>
        </button>
      </div>
    </div>
  );
};

export default ChildSearch;

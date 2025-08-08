import React from "react";

const ChildForm = ({
  data,
  formData,
  handleInputChange,
  regenerateChildID,
  handleFormSubmit,
}: any) => {
  return (
    <div>
      {" "}
      <div className="grid grid-cols-2 gap-4">
        {/* Child Name Input */}
        <div className="mt-4">
          <label className="block text-gray-600 text-sm font-bold mb-2">
            {`What's Your Star's Name?`}
          </label>
          <input
            className="w-full px-4 py-2 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
            type="text"
            placeholder="Enter Child's Name"
            id="childName"
            name="childName"
            value={data?.childName || formData.childName}
            onChange={handleInputChange}
          />
        </div>

        {/* Child ID Input */}
        <div className="mt-4">
          <label className="block text-gray-600 text-sm font-bold mb-2">
            {`What's Your Star's ID?`}
          </label>
          <div className="flex">
            <input
              className="w-full px-4 py-2 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
              type="text"
              placeholder="Auto-generated unique ID"
              id="childID"
              name="childID"
              value={data?.childID || formData.childID}
              onChange={handleInputChange}
            />
            <button
              type="button"
              onClick={regenerateChildID}
              className="ml-2 px-3 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              title="Generate new ID"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            A unique ID is automatically generated, but you can modify it if
            needed.
          </p>
        </div>

        {/* Child DOB Input */}
        <div className="mt-4">
          <label className="block text-gray-600 text-sm font-bold mb-2">
            {`What's Your Star's Date of Birth?`}
          </label>
          <input
            className="w-full px-4 py-2 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
            type="date"
            id="childDOB"
            name="childDOB"
            value={data?.childDOB || formData.childDOB}
            onChange={handleInputChange}
          />
        </div>

        {/* Child Gender Input */}
        <div className="mt-4">
          <label
            htmlFor="childGender"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            {`What's Your Superstar's Gender?`}
          </label>
          <select
            id="childGender"
            name="childGender"
            value={data?.childGender || formData.childGender}
            onChange={handleInputChange}
            className="w-full px-4 py-2 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
          >
            <option value="" disabled>
              Select Gender
            </option>
            <option value="male">Prince (Male)</option>
            <option value="female">Princess (Female)</option>
            <option value="other">Unique Star (Other)</option>
          </select>
        </div>
        {/* Child Address Input */}
        <div className="mt-4 col-span-2">
          <label className="block text-gray-600 text-sm font-bold mb-2">
            {`Where Does Your Star Live?`}
          </label>
          <input
            className="w-full px-4 py-2 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
            type="text"
            placeholder="Enter Child's Address"
            id="childAddress"
            name="childAddress"
            value={data?.childAddress || formData.childAddress || ""}
            onChange={handleInputChange}
          />
        </div>
        {/* Observer ID */}
        <div className="mt-4 col-span-2">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Your Observer ID
          </label>
          <p className="w-full px-4 py-2 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white">
            {data?.observerID || formData.observerID}
          </p>
        </div>
      </div>
      <button
        disabled={data?.childID}
        onClick={() => handleFormSubmit()}
        className="mt-5 tracking-wide font-semibold bg-primary text-gray-100 w-full py-3 rounded-lg hover:bg-primary/80 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
      >
        <svg
          className="w-6 h-6 -ml-2"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
          <circle cx="8.5" cy="7" r="4" />
          <path d="M20 8v6M23 11h-6" />
        </svg>
        <span className="ml-3">Let’s Start the Test!</span>
      </button>
      <p className="mt-6 text-xs text-gray-600 text-center">
        By proceeding, you agree to our{" "}
        <a href="#" className="border-b border-gray-500 border-dotted">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className="border-b border-gray-500 border-dotted">
          Privacy Policy
        </a>
        .
      </p>
    </div>
  );
};

export default ChildForm;

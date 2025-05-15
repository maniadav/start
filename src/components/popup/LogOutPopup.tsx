"use client";
import { API_ENDPOINT } from "@constants/api.constant";
import { IndexDB_Storage } from "@constants/storage.constant";
import { clearEntireIndexedDB, removeIndexedDBValue } from "@utils/indexDB";
import { clearLocalStorageValue } from "@utils/localStorage";
import BatchDataDownloadButton, {
  handleBatchDownload,
} from "components/BatchDataDownloadButton";
import { PopupModal } from "components/common/PopupModal";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaExclamationTriangle, FaSignOutAlt } from "react-icons/fa";
import { FaDownload, FaUpload } from "react-icons/fa6";

interface msgPopUp {
  showFilter: boolean;
  closeModal: any;
}
const LogOutPopupModal = ({ showFilter, closeModal }: msgPopUp) => {
  const router = useRouter();

  const [isCleaningData, setIsCleaningData] = useState(false);

  const handleSecureLogout = async () => {
    try {
      setIsCleaningData(true);

      await Promise.all([
        removeIndexedDBValue(
          IndexDB_Storage.surveyDB,
          IndexDB_Storage.surveyData
        ),
      ]);

      clearLocalStorageValue();
      router.push(`${API_ENDPOINT.auth.login}`);
    } catch (err) {
      console.error("Data cleanup error:", err);
      alert("Failed to clear data. Please try again.");
    } finally {
      setIsCleaningData(false);
    }
  };

  return (
    <PopupModal
      show={showFilter}
      slideBottom={true}
      onRequestClose={closeModal}
    >
      <div className="fixed inset-0 w-full h-full flex items-center justify-center overflow-y-auto bg-black bg-opacity-50 backdrop-blur-sm z-50">
        <div className="relative p-4 w-full max-w-xl max-h-full">
          <div className="relative bg-white rounded-xl shadow-2xl p-8 space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
              <FaExclamationTriangle className="w-8 h-8 text-red-500 shrink-0" />
              <div className="flex flex-col gap-1 w-full">
                <h3 className="text-2xl font-bold text-gray-900">
                  Unsaved Data Alert
                </h3>
                <p className="text-gray-600 mt-1 text-base md:text-sm">
                  You have unsaved data that will be lost if you logout now
                </p>
              </div>
            </div>

            {/* Data Preservation Options */}
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-3">
                  Save Your Data First
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    className="cursor-pointer w-full p-4 bg-white rounded-lg border border-blue-200 hover:border-blue-400 transition-all flex flex-col items-center md:flex-row md:items-center gap-3"
                    onClick={() => handleBatchDownload()}
                  >
                    <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0 flex items-center justify-center">
                      <FaDownload className="w-8 h-8 md:w-6 md:h-6 text-blue-600" />
                    </div>
                    <div className="text-left w-full">
                      <span className="block font-semibold text-base md:text-sm">
                        Download Locally
                      </span>
                      <span className="text-sm text-gray-600">
                        Save CSV files to your device
                      </span>
                    </div>
                  </button>
                  <button
                    className="cursor-pointer w-full p-4 bg-white rounded-lg border border-blue-200 hover:border-blue-400 transition-all flex flex-col items-center md:flex-row md:items-center gap-3"
                    onClick={() => {
                      alert("yet to connect with server");
                    }}
                  >
                    <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0 flex items-center justify-center">
                      <FaUpload className="w-8 h-8 md:w-6 md:h-6 text-blue-600" />
                    </div>
                    <div className="text-left w-full">
                      <span className="block font-semibold text-base md:text-sm">
                        Upload to Server
                      </span>
                      <span className="text-sm text-gray-600">
                        Sync your data securely
                      </span>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col md:flex-row justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-5 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors w-full md:w-auto"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSecureLogout()}
                className="px-5 py-2.5 text-white bg-red-600 hover:bg-red-700 rounded-lg font-medium transition-colors flex items-center gap-2 w-full md:w-auto justify-center"
              >
                <FaSignOutAlt />
                {isCleaningData ? "Cleaning..." : "Logout"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </PopupModal>
  );
};

export default LogOutPopupModal;

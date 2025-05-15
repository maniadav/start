import { BASE_URL } from "@constants/config.constant";
import { PopupModal } from "components/common/PopupModal";
import { FaSyncAlt, FaExclamationCircle } from "react-icons/fa";
import Image from "next/image";

interface CameraPermissionPopupProps {
  show: boolean;
  onRequestClose: () => void;
}

const CameraPermissionPopup = ({
  show,
  onRequestClose,
}: CameraPermissionPopupProps) => {
  return (
    <PopupModal show={show} slideBottom={true} onRequestClose={onRequestClose}>
      <div className="fixed inset-0 w-full h-full flex items-center justify-center overflow-y-auto bg-black bg-opacity-50 backdrop-blur-sm z-50">
        <div className="relative p-4 w-full max-w-xl max-h-full">
          <div className="relative bg-white rounded-xl shadow-2xl p-8 space-y-6">
            <div className="flex items-center gap-3">
              <FaExclamationCircle className="w-8 h-8 text-red-500 shrink-0" />
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  No Camera Access
                </h3>
                <p className="text-gray-600 mt-1">
                  Camera access is required to continue. Please allow camera
                  permission in your browser settings.
                </p>
              </div>
            </div>
            <div className="relative flex flex-col items-center mt-4">
              <div className="w-full flex flex-col items-center">
                <Image
                  src={`${BASE_URL}/image/arrow.png`}
                  width={50}
                  height={50}
                  alt="camera"
                  className="w-20 h-20 rounded-2xl rotate-[150deg]"
                />

                <div className="relative w-auto h-96 flex items-center justify-center">
                  <Image
                    src={`${BASE_URL}/image/camera-access.png`}
                    width={200}
                    height={200}
                    alt="camera"
                    className="w-full h-full rounded-2xl"
                  />
                </div>
              </div>
              <span className="text-green-500/80 text-sm mt-2">
                After allowing, please refresh the page.
              </span>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={onRequestClose}
                className="px-5 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </PopupModal>
  );
};

export default CameraPermissionPopup;

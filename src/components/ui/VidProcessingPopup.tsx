"use client";
import { PopupModal } from "./PopupModal";
import { useRouter } from "next/navigation";
import MediaPipeHandler from "components/mediapipe/MediaPipeHandler";

interface msgPopUp {
  attempt: number;
  taskID: string;
  showFilter: boolean;
  onRequestClose?: any;
  onProcessComplete: any;
  showPopupActionButton: boolean;
}
const VidProcessingPopup = ({
  showFilter,
  showPopupActionButton,
  taskID,
  attempt,
}: msgPopUp) => {
  const router = useRouter();
  console.log({ showFilter });
  return (
    <PopupModal show={showFilter} slideBottom={true}>
      <div className="fixed top-0 right-0 left-0 botom-0  w-full h-full flex items-center align-middle justify-center align-center overflow-y-auto bg-black">
        <div className="relative p-4 w-full max-w-xl max-h-full">
          <div className="relative bg-white rounded-lg shadow ">
            <div className="p-4 md:p-5 space-y-4">
              <MediaPipeHandler
                showAction={showPopupActionButton}
                showFilter={showFilter}
                attempt={attempt}
                taskID={taskID}
              />
            </div>
          </div>
        </div>
      </div>
    </PopupModal>
  );
};

export default VidProcessingPopup;

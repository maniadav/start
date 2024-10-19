'use client';
import VideoDetection from 'app/preferential-looking-task/VideoDetection';
import { PopupModal2 } from './PopupModal';
import { useRouter } from 'next/navigation';

interface msgPopUp {
  showFilter: boolean;
  onRequestClose?: any;
  onProcessComplete: any;

  reAttemptUrl: string | null;
}
const VidProcessingPopup = ({ showFilter, reAttemptUrl }: msgPopUp) => {
  const router = useRouter();
  console.log({ showFilter });
  return (
    <PopupModal2 show={showFilter} slideBottom={true}>
      <div className="fixed top-0 right-0 left-0 botom-0  w-full h-full flex items-center align-middle justify-center align-center overflow-y-auto bg-black">
        <div className="relative p-4 w-full max-w-xl max-h-full">
          <div className="relative bg-white rounded-lg shadow ">
            <div className="p-4 md:p-5 space-y-4">
              <VideoDetection reAttemptUrl={reAttemptUrl} />
            </div>
          </div>
        </div>
      </div>
    </PopupModal2>
  );
};

export default VidProcessingPopup;

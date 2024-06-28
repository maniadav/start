"use client";
import { PopupModal2 } from "./PopupModal";
import { useRouter } from "next/navigation";

interface msgPopUp {
  showFilter: boolean;
  onRequestClose?: any;
  msg: string;
  testName: string;
  reAttemptUrl: string | null;
}
const MessagePopup = ({
  showFilter,
  msg,
  testName,
  reAttemptUrl,
}: msgPopUp) => {
  const router = useRouter();

  return (
    <PopupModal2
      show={showFilter}
      // onRequestClose={() => onRequestClose(!showFilter)}
      slideBottom={true}
    >
      <div className="fixed top-0 right-0 left-0 botom-0  w-full h-full flex items-center align-middle justify-center align-center overflow-y-auto">
        <div className="relative p-4 w-full max-w-xl max-h-full">
          <div className="relative bg-white rounded-lg shadow ">
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 className="text-xl capitalize text-center font-semibold text-gray-900">
                {`Hurray, ${testName} Test Completed!!`}
              </h3>
              <button
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                onClick={() => router.push("/survey")}
              >
                <svg
                  className="w-3 h-3"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            <div className="p-4 md:p-5 space-y-4">
              <p className="text-base leading-relaxed text-gray-300 dark:text-gray-600 flex gap-2">
                {msg}
              </p>
            </div>

            <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
              <button
                onClick={() => router.push("/survey")}
                className="capitalize  text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center  dark:hover:bg-red-700 dark:focus:ring-red-800"
              >
                Go to Dashboard
              </button>
              {reAttemptUrl && (
                <a
                  // onClick={() => router.replace(reAttemptUrl)}
                  href={reAttemptUrl}
                  className="ms-3 text-gray-200 bg-gray-600 hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-red-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5"
                >
                  Create New Attempt
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </PopupModal2>
  );
};

export default MessagePopup;

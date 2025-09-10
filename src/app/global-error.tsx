"use client";

import CacheResetButton from "@components/ui/CacheResetButton";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-scree h-screen flex items-center justify-center bg-gray-50">
          <div className="flex flex-col items-center justify-center p-8 bg-white rounded-xl shadow-lg max-w-md w-full border border-gray-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-20 w-20 text-red-500 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="2"
                fill="#fee2e2"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01"
              />
            </svg>
            <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
              Oops! Something went wrong
            </h2>
            <p className="text-gray-600 mb-4 text-center">
              {
                "An unexpected error occurred. Please try again or reset the cache."
              }
            </p>
            <div className="flex flex-col gap-2 w-full">
              <CacheResetButton />
              <button
                // onClick={() => reset()}
                className="mt-2 px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}

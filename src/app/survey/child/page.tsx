"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { setLocalStorageValue } from "@utils/localStorage";
import { LOCALSTORAGE } from "@constants/storage.constant";
import Image from "next/image";
import { IconHome } from "components/common/Icons";
import Link from "next/link";
import { BASE_URL } from "@constants/config.constant";
import { useSurveyContext } from "state/provider/SurveytProvider";
import { PAGE_ROUTES } from "@constants/route.constant";

interface LoginDataType {
  childID: string;
  childName: string;
  childGender: string;
  childDob: string;
  observerID: string;
}

const LoginPage = () => {
  const [formData, setFormData] = useState<LoginDataType>({
    childID: "",
    childName: "",
    childGender: "",
    childDob: "",
    observerID: "",
  });

  const router = useRouter();
  const { dispatch } = useSurveyContext();

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = async () => {
    // Validation checks
    if (!formData.childName.trim()) {
      toast.error("Oops! Don't forget to enter the child's name.");
      return;
    }
    if (!formData.childId.trim()) {
      toast.error("Oops! Don't forget to enter the child's ID.");
      return;
    }
    if (!formData.childDob.trim()) {
      toast.error("Oops! Don't forget to enter the child's date of birth.");
      return;
    }
    if (!formData.observerId.trim()) {
      toast.error("Hey there! Your Observer ID is missing.");
      return;
    }

    // Use toast.promise for better user feedback
    toast.promise(
      (async () => {
        try {
          setLocalStorageValue(LOCALSTORAGE.START_USER, formData, true);
          dispatch({ type: "RESET_SURVEY_DATA" });
          await new Promise((resolve) => setTimeout(resolve, 800)); // Brief delay for UX
          router.push(PAGE_ROUTES.SURVEY.path);
          return "success";
        } catch (error) {
          console.error("API call error:", error);
          throw new Error("Something went wrong. Please try again!");
        }
      })(),
      {
        loading: "Setting up your session...",
        success: "All set! Redirecting to survey...",
        error: (err) => `${err.message}`,
      }
    );
  };

  return (
    <div className="overflow-hidden relative w-full h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
        <div className="max-w-screen-xl m-0 sm:m-10 bg-white shadow sm:rounded-lg flex justify-center flex-1">
          <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12 h-full overflow-scroll">
            <Link
              className="flex px-4 justify-between items-center"
              href="/"
              legacyBehavior
            >
              <div className="flex flex-row gap-4 items-center align-middle">
                <p className="text-xl md:text-4xl font-bold ">
                  <span className="ml-2 text-primary">←</span>
                </p>
                <span className="font-bold text-xl md:text-4xl">
                  <IconHome />
                </span>
              </div>
            </Link>
            <div>
              <Image
                width={200}
                height={200}
                src={`${BASE_URL}/image/start.png`}
                className="w-52 mx-auto"
                alt="logo"
              />
            </div>
            <div className="flex flex-col items-center">
              <h1 className="text-2xl xl:text-3xl font-extrabold text-primary">
                Ready for Some Magic?
              </h1>
              <p className="text-gray-400 mt-2">
                Let’s help your little star shine brighter!
              </p>
              <div className="w-full flex-1 mt-8">
                <div className="mx-auto max-w-xs">
                  {/* Child Name Input */}
                  <div className="mt-4">
                    <label className="block text-gray-600 text-sm font-bold mb-2">
                      What’s Your Star’s Name?
                    </label>
                    <input
                      className="w-full px-4 py-2 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                      type="text"
                      placeholder="Enter Child's Name"
                      id="childName"
                      name="childName"
                      value={formData.childName}
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* Child ID Input */}
                  <div className="mt-4">
                    <label className="block text-gray-600 text-sm font-bold mb-2">
                      What’s Your Star’s ID?
                    </label>
                    <input
                      className="w-full px-4 py-2 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                      type="text"
                      placeholder="Enter Child's ID"
                      id="childID"
                      name="childID"
                      value={formData.childId}
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* Child DOB Input */}
                  <div className="mt-4">
                    <label className="block text-gray-600 text-sm font-bold mb-2">
                      What’s Your Star’s Date of Birth?
                    </label>
                    <input
                      className="w-full px-4 py-2 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                      type="date"
                      id="childDob"
                      name="childDob"
                      value={formData.childDob}
                      onChange={handleInputChange}
                    />
                  </div>
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
                      value={formData.childGender}
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

                  {/* Observer ID Input */}
                  <div className="mt-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Your Observer ID
                    </label>
                    <input
                      className="w-full px-4 py-2 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                      type="text"
                      placeholder="Enter Your ID"
                      id="observerID"
                      name="observerID"
                      value={formData.observerId}
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    onClick={handleFormSubmit}
                    className="mt-5 tracking-wide font-semibold bg-primary text-gray-100 w-full py-3 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
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
                    <a
                      href="#"
                      className="border-b border-gray-500 border-dotted"
                    >
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a
                      href="#"
                      className="border-b border-gray-500 border-dotted"
                    >
                      Privacy Policy
                    </a>
                    .
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* Background Section */}
          <div className="relative flex-1 bg-indigo-100 text-center hidden lg:flex">
            <div
              className="absolute w-full h-full bg-cover bg-top bg-no-repeat"
              style={{
                backgroundImage: `url('${BASE_URL}/image/hand.jpg')`,
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

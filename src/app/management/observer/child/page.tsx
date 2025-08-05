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
import SidebarTrigger from "@management/SidebarTrigger";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "components/ui/card";
import { FileText } from "lucide-react";
import { useAuth } from "state/provider/AuthProvider";
import { Button } from "@management/components/ui/button";

interface LoginDataType {
  childID: string;
  childName: string;
  childGender: string;
  childDOB: string;
  observerID: string;
}

const LoginPage = () => {
  const { member, user } = useAuth();
  const [formData, setFormData] = useState<LoginDataType>({
    childID: user?.childID || "",
    childName: user?.childName || "",
    childGender: user?.childGender || "",
    childDOB: user?.childDOB || "",
    observerID: member?.user_id || "",
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
    if (!formData.childName.trim()) {
      toast.error("Oops! Don't forget to enter the child's name.");
      return;
    }
    if (!formData.childID.trim()) {
      toast.error("Oops! Don't forget to enter the child's ID.");
      return;
    }
    if (!formData.childDOB.trim()) {
      toast.error("Oops! Don't forget to enter the child's date of birth.");
      return;
    }
    if (!formData.observerID.trim()) {
      toast.error("Hey there! Your Observer ID is missing.");
      return;
    }

    try {
      setLocalStorageValue(LOCALSTORAGE.START_USER, formData, true);
      dispatch({ type: "RESET_SURVEY_DATA" });
      router.push(PAGE_ROUTES.SURVEY.path);
    } catch (error) {
      console.error("API call error:", error);
      toast.error("Something went wrong. Please try again!");
    }
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center space-x-2">
        <SidebarTrigger />
        <h2 className="text-3xl font-bold tracking-tight">Add Child</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4 mt-4 rounded">
              <div className="flex items-center">
                <svg
                  className="h-6 w-6 text-red-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <div className="ml-3">
                  <p className="text-sm text-red-700 font-medium">
                    <strong>WARNING:</strong>{" "}
                    {user?.childID
                      ? `Download or upload the survey data before removing the child`
                      : `You must add a child in order to start the survey.`}
                  </p>
                </div>
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <div className="w-full flex items-center justify-end px-12 gap-4 ">
          <Button
            variant={"default"}
            disabled={!user?.childID}
            className="flex items-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <path d="M3 6h18" />
              <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
              <path d="M10 11v6" />
              <path d="M14 11v6" />
            </svg>
            Remove Current Child
          </Button>
          <Button
            variant={"outline"}
            disabled={!user?.childID}
            className="flex items-center gap-2"
          >
            <svg
              className="w-5 h-5 text-blue-500"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <path d="M12 16v-8" />
              <path d="M8 12l4 4 4-4" />
              <path d="M20 20H4" />
            </svg>
            Download Current Survey
          </Button>
        </div>
        <CardContent>
          <div className="w-full p-6 sm:p-12 h-full overflow-scroll">
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
                {`Let’s help your little star shine brighter!`}
              </p>

              <div className="w-full flex-1 mt-8">
                <div className="mx-auto max-w-2xl">
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
                        value={formData.childName}
                        onChange={handleInputChange}
                      />
                    </div>

                    {/* Child ID Input */}
                    <div className="mt-4">
                      <label className="block text-gray-600 text-sm font-bold mb-2">
                        {`What's Your Star's ID?`}
                      </label>
                      <input
                        className="w-full px-4 py-2 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                        type="text"
                        placeholder="Enter Child's ID"
                        id="childID"
                        name="childID"
                        value={formData.childID}
                        onChange={handleInputChange}
                      />
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
                        value={formData.childDOB}
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

                    {/* Observer ID */}
                    <div className="mt-4 col-span-2">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Your Observer ID
                      </label>
                      <p className="w-full px-4 py-2 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white">
                        {formData.observerID}
                      </p>
                    </div>
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
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;

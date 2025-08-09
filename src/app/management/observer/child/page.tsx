"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { setLocalStorageValue } from "@utils/localStorage";
import { LOCALSTORAGE } from "@constants/storage.constant";
import Image from "next/image";
import { v4 as uuidv4 } from "uuid";
import { BASE_URL } from "@constants/config.constant";
import { useSurveyContext } from "state/provider/SurveytProvider";
import { PAGE_ROUTES } from "@constants/route.constant";
import SidebarTrigger from "@management/SidebarTrigger";
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";
import { useAuth } from "state/provider/AuthProvider";
import { Button } from "@management/components/ui/button";
import ChildForm from "./ChildForm";
import ChildSearch from "./ChildSearch";
import StartUtilityAPI from "@services/start.utility";

interface LoginDataType {
  childId: string;
  childName: string;
  childGender: string;
  childDob: string;
  observerId: string;
  childAddress: string;
}

const generateUniqueID = () => {
  const uuid = uuidv4();
  return `ch${uuid.substring(0, 8)}`.toUpperCase();
};

const LoginPage = () => {
  const [data, setData] = useState<any>(null);
  const { member, user: childData } = useAuth();
  const [formData, setFormData] = useState<LoginDataType>({
    childId: childData?.childId || "",
    childName: childData?.childName || "",
    childGender: childData?.childGender || "",
    childDob: childData?.childDob || "",
    observerId: member?.userId || "",
    childAddress: childData?.childAddress || "",
  });
  const START_API = new StartUtilityAPI();
  // Set initial data from state
  useEffect(() => {
    if (childData) {
      setData((prev: any) => ({ ...prev, childData }));
    }
  }, [childData]);

  // Generate a unique ID if none exists
  // useEffect(() => {
  //   if (!formData.childId) {
  //     const newID = generateUniqueID();
  //     setFormData((prev) => ({ ...prev, childId: newID }));
  //   }
  // }, [formData.childId, formData.observerId, member?.user_id]);

  const router = useRouter();
  const { dispatch } = useSurveyContext();

  const handleDataFetch = async ({ childId }: any) => {
    try {
      const response = await START_API.child.fetch(childId);
      if (response.success) {
        setData(response.data.profile);
        toast.success(response.message || "Child details fetched successfully");
      } else {
        toast.error(response.message || "Failed to fetch child details");
      }
    } catch (error) {
      console.error("Error fetching child details:", error);
      toast.error("An error occurred while fetching child details.");
    }
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const regenerateChildID = () => {
    setFormData((prev) => ({
      ...prev,
      childId: generateUniqueID(),
    }));
  };

  const handleFormSubmit = async () => {
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
    if (!formData.childAddress?.trim()) {
      toast.error("Please enter the child's address.");
      return;
    }

    try {
      const response = await START_API.child.create({
        ...formData,
      });
      console.log(response);
      setLocalStorageValue(LOCALSTORAGE.START_USER, response.profile, true);
      dispatch({ type: "RESET_SURVEY_DATA" });
      router.push(PAGE_ROUTES.MANAGEMENT.OBSERVER.SURVEY.path);
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
                    {childData?.childId
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
            disabled={!childData?.childId}
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
            disabled={!childData?.childId}
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
                {`Let's help your little star shine brighter!`}
              </p>

              <div className="w-full flex-1 mt-8">
                <div className="mx-auto max-w-2xl">
                  <ChildSearch handleDataFetch={handleDataFetch} />

                  <div className="relative my-12">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center">
                      <span className="bg-white px-4 text-sm font-medium text-primary uppercase">
                        or add a new child
                      </span>
                    </div>
                  </div>

                  <ChildForm
                    data={data}
                    formData={formData}
                    handleInputChange={handleInputChange}
                    regenerateChildID={regenerateChildID}
                    handleFormSubmit={handleFormSubmit}
                  />
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

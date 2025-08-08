import React, { useState } from "react";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";
import {
  getLocalStorageValue,
  setLocalStorageValue,
} from "@utils/localStorage";
import { LOCALSTORAGE } from "@constants/storage.constant";
import StartUtilityAPI from "@services/start.utility";

const UserProfileUpdate = () => {
  const userData = getLocalStorageValue(LOCALSTORAGE.START_MEMBER, true) || {};

  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const formData: FormDataType = {};
  const [responseBody, setResponseBody] = useState<FormDataType>(formData);
  const inputChangeHandler = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setResponseBody({ ...responseBody, [name]: value });
  };
  const START_API = new StartUtilityAPI();

  const updateProfileData = async () => {
    try {
      const profileResponse = await START_API.user.update(responseBody);

      if (profileResponse?.data?.data) {
        setLocalStorageValue(
          LOCALSTORAGE.START_MEMBER,
          profileResponse.data.data,
          true
        );
        toast("profile updated");
        console.log("Profile updated successfully:", profileResponse.data);
      }
    } catch (error: any) {
      toast("something went wrong");
      console.error(error.message);
    }
  };

  // image upload
  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setSelectedFile(selectedFile);

      const filePreviewURL = URL.createObjectURL(selectedFile);
      setFilePreview(filePreviewURL);
    }
  };

  const uploadImage = async () => {
    if (!selectedFile) {
      toast("Please select an image to upload.");
      return;
    }
    toast("uploading image...");
    const formData = new FormData();
    formData.append("image", selectedFile);
    formData.append("caption", selectedFile.name.split(".")[0]);

    try {
      // Upload the image
      const response = await START_API.utility.uploadImage(formData);

      if (response?.data?.publicUrl) {
        toast("upading profile...");

        const profileResponse = await START_API.user.update({
          profile: response.data.publicUrl,
        });

        if (profileResponse?.data) {
          setLocalStorageValue(
            LOCALSTORAGE.START_MEMBER,
            profileResponse.data.data,
            true
          );
          toast("profile image uploaded");
          console.log("Profile updated successfully:", profileResponse.data);
        } else {
          console.error("No data received when updating profile");
        }
      } else {
        console.error("No public URL returned after uploading image");
      }
    } catch (error) {
      toast("somethign went wrong");
      console.error("Error during image upload or profile update:", error);
    }
  };

  return (
    <div className="p-2 md:p-4 border-b" id="profile-update">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="w-full px-6 pb-8 mt-8 sm:max-w-xl sm:rounded-lg">
        <h2 className="pl-6 text-2xl font-bold sm:text-xl">Public Profile</h2>
        <div className="w-full py-4">
          <div className="grid max-w-2xl mx-auto mt-8">
            <div className="flex flex-col items-center space-y-5 sm:flex-row sm:space-y-0">
              <Image
                width={100}
                height={100}
                className="object-cover w-40 h-40 p-1 rounded-full ring-2 ring-indigo-300 dark:ring-indigo-500"
                src={filePreview || userData?.profile || "/images/user.svg"}
                alt="Bordered avatar"
              />

              <div className="flex flex-col space-y-5 sm:ml-8">
                <div className="overflow-hidden relative w-64 mt-4 mb-4">
                  <label className="flex flex-row gap-2 items-center place-items-center py-3.5 px-7 text-base font-medium text-indigo-100 focus:outline-none bg-[#202142] rounded-lg border border-indigo-200 hover:bg-indigo-900 focus:z-10 focus:ring-4 focus:ring-indigo-200">
                    {/* <CommonIcon icon="material-symbols:upload-sharp" /> */}
                    <span className="text-base leading-normal">
                      Change Picture
                    </span>
                    <input
                      type="file"
                      className="hidden h-full w-full cursor-pointer"
                      onChange={onFileChange}
                    />
                  </label>
                </div>
                {selectedFile && (
                  <div className="overflow-hidden relative mt-4 mb-4 w-full">
                    <button
                      className="w-full flex flex-row gap-2 items-center place-items-center py-3.5 px-7 text-base font-medium text-indigo-900 focus:outline-none bg-white rounded-lg border border-indigo-200 hover:bg-indigo-100 hover:text-[#202142] focus:z-10 focus:ring-4 focus:ring-indigo-200"
                      onClick={uploadImage}
                    >
                      {/* <CommonIcon icon="material-symbols:delete-outline" /> */}
                      <span className="text-base leading-normal">
                        Upload Picture
                      </span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="items-center mt-8 sm:mt-14 text-[#202142]">
              <div className="flex flex-col items-center w-full mb-2 space-x-0 space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0 sm:mb-6">
                <div className="w-full">
                  <label
                    htmlFor="first_name"
                    className="block mb-2 text-sm font-medium text-indigo-900 "
                  >
                    Your first name
                  </label>

                  <input
                    onChange={(e) => inputChangeHandler(e)}
                    name="firstName"
                    className="capitalize bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 "
                    type="text"
                    placeholder={userData?.firstName || "Enter Your First Name"}
                    required
                  />
                </div>

                <div className="w-full">
                  <label
                    htmlFor="last_name"
                    className="block mb-2 text-sm font-medium text-indigo-900"
                  >
                    Your last name
                  </label>

                  <input
                    onChange={(e) => inputChangeHandler(e)}
                    name="lastName"
                    type="text"
                    className="capitalize bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 "
                    placeholder={userData?.lastName || "Your last name"}
                    required
                  />
                </div>
              </div>

              <div className="mb-2 sm:mb-6">
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-indigo-900"
                >
                  Your email
                </label>

                <input
                  onChange={(e) => inputChangeHandler(e)}
                  name="email"
                  type="email"
                  className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 "
                  placeholder={userData?.email || "your.email@mail.com"}
                  required
                />
              </div>

              <div className="mb-2 sm:mb-6">
                <label
                  htmlFor="profession"
                  className="block mb-2 text-sm font-medium text-indigo-900 "
                >
                  Mobile Number
                </label>
                <input
                  onChange={(e) => inputChangeHandler(e)}
                  name="number"
                  type="number"
                  className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 "
                  required
                  placeholder={userData.mobile || "Mobile No."}
                />
              </div>

              <div className="mb-6">
                <label
                  htmlFor="message"
                  className="block mb-2 text-sm font-medium text-indigo-900 "
                >
                  Address
                </label>
                <textarea
                  onChange={(e) => inputChangeHandler(e)}
                  name="address"
                  rows={4}
                  className="block p-2.5 w-full text-sm text-indigo-900 bg-indigo-50 rounded-lg border border-indigo-300 focus:ring-indigo-500 focus:border-indigo-500 "
                  placeholder={userData.address || "Write address..."}
                ></textarea>
              </div>

              <div className="flex justify-start">
                <button
                  onClick={() => updateProfileData()}
                  className=" text-white bg-gradient-to-br from-blue-700 to-blue-900 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileUpdate;

interface FormDataType {
  [key: string]: string;
}

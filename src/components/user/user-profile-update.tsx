import React, { useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { setLocalStorageValue } from "@utils/localStorage";
import { LOCALSTORAGE } from "@constants/storage.constant";
import StartUtilityAPI from "@services/start.utility";
import { useAuth } from "state/provider/AuthProvider";
import startUtilityAPI from "@services/start.utility";

const MemberProfileUpdate = () => {
  const { member } = useAuth();
  console.log({ member });

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

  const updateProfileData = async () => {
    try {
      const profileResponse = await startUtilityAPI.user.update(responseBody);

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
      const response = await startUtilityAPI.utility.uploadImage(formData);

      if (response?.data?.publicUrl) {
        toast("upading profile...");

        const profileResponse = await startUtilityAPI.user.update({
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
      <div className="w-full px-6 pb-8 mt-8 sm:max-w-xl sm:rounded-lg">
        <h2 className="pl-6 text-2xl font-bold sm:text-xl">Public Profile</h2>
        <div className="w-full py-4">
          <div className="grid max-w-2xl mx-auto mt-8">
            <div className="flex flex-col items-center space-y-5 sm:flex-row sm:space-y-0">
              <Image
                width={100}
                height={100}
                className="object-cover w-40 h-40 p-1 rounded-full ring-2 ring-primary/40 dark:ring-primary"
                src={filePreview || member?.profile?.profile || "/svg/user.svg"}
                alt="Bordered avatar"
              />

              <div className="flex flex-col space-y-5 sm:ml-8">
                <div className="overflow-hidden relative w-64 mt-4 mb-4">
                  <label className="flex flex-row gap-2 items-center place-items-center py-3.5 px-7 text-base font-medium text-indigo-100 focus:outline-none bg-black rounded-lg border border-indigo-200 hover:bg-black focus:z-10 focus:ring-4 focus:ring-indigo-200">
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
                      className="w-full flex flex-row gap-2 items-center place-items-center py-3.5 px-7 text-base font-medium text-black focus:outline-none bg-white rounded-lg border border-indigo-200 hover:bg-indigo-100 hover:text-black focus:z-10 focus:ring-4 focus:ring-indigo-200"
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

            <div className="items-center mt-8 sm:mt-14 text-black">
              <div className="flex flex-col items-center w-full mb-2 space-x-0 space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0 sm:mb-6">
                <div className="w-full">
                  <label
                    htmlFor="first_name"
                    className="block mb-2 text-sm font-medium text-black "
                  >
                    Your Name
                  </label>

                  <input
                    onChange={(e) => inputChangeHandler(e)}
                    name="firstName"
                    className="capitalize bg-indigo-50 border border-primary/40 text-black text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 "
                    type="text"
                    placeholder={
                      member?.profile?.name || "Enter Your First Name"
                    }
                    required
                  />
                </div>
              </div>

              <div className="mb-2 sm:mb-6">
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-black"
                >
                  Your email
                </label>

                <input
                  onChange={(e) => inputChangeHandler(e)}
                  name="email"
                  type="email"
                  className="bg-indigo-50 border border-primary/40 text-black text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 "
                  placeholder={member?.profile?.email || "your.email@mail.com"}
                  required
                />
              </div>

              <div className="mb-6">
                <label
                  htmlFor="message"
                  className="block mb-2 text-sm font-medium text-black "
                >
                  Address
                </label>
                <textarea
                  onChange={(e) => inputChangeHandler(e)}
                  name="address"
                  rows={4}
                  className="block p-2.5 w-full text-sm text-black bg-indigo-50 rounded-lg border border-primary/40 focus:ring-primary focus:border-primary "
                  placeholder={member?.profile?.address || "Write address..."}
                ></textarea>
              </div>

              <div className="flex justify-start">
                <button
                  onClick={() => updateProfileData()}
                  className=" text-white bg-gradient-to-br from-primary to-primary/80 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
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

export default MemberProfileUpdate;

interface FormDataType {
  [key: string]: string;
}

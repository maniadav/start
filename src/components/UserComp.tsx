"use client";
import { LOCALSTORAGE } from "@constants/storage.constant";
import { getLocalStorageValue } from "@utils/localStorage";

const ContentPage = () => {
  const user = getLocalStorageValue(LOCALSTORAGE.LOGGED_IN_USER, true);

  return (
    <div className="flex justify-center items-center p-8 lg:p-12">
      <div className="w-full max-w-sm  hover:shadow-indigo-300 hover:shadow-lg rounded-lg border">
        <div className="flex justify-center items-start flex-col p-5 ">
          <div className="flex flex-row gap-2 items-center align-middle">
            <h3 className="text-base md:text-lg font-semibold">User Name:</h3>
            <p className="capitalize text-xs md:text-sm">
              {user?.childName || "User"}
            </p>
          </div>
          <div className="flex flex-row gap-2 items-center align-middle">
            <h3 className="text-base md:text-lg font-semibold">User ID:</h3>
            <p className="capitalize text-xs md:text-sm">
              {user?.childID ?? "1232"}
            </p>
          </div>
          <div className="flex flex-row gap-2 items-center align-middle">
            <h3 className="text-base md:text-lg font-semibold">DOB:</h3>
            <p className="text-xs md:text-sm">{user?.childDOB || "23/23/25"}</p>
          </div>
          <div className="capitalize flex flex-row gap-2 items-center align-middle">
            <h3 className="text-base md:text-lg font-semibold">Gender:</h3>
            <p className="capitalize text-xs md:text-sm">{user?.childGender}</p>
          </div>
        </div>
        <div className="bg-sky-500 p-0.5 rounded-b-lg"></div>
      </div>
    </div>
  );
};

export default ContentPage;

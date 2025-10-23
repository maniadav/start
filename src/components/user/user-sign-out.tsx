import LogOutPopupModal from "@components/popup/LogOutPopup";
import { hasValidRole, logOut } from "@utils/auth.utils";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { PAGE_ROUTES } from "@constants/route.constant";
import { useAuth } from "state/provider/AuthProvider";
import { MemberRole } from "@type/member.types";
import { MemberProfile } from "@constants/management.constant";

const UserSignOut = () => {
  const [showPopup, setShowPopup] = useState(false);
  const router = useRouter();
  const { member } = useAuth();
  const download_survey_data = hasValidRole(member, [
    MemberProfile.observer as MemberRole,
  ]);

  const handleLogout = () => {
    logOut();
    router.push(PAGE_ROUTES.LOGIN.path);
  };

  return (
    <div className="p-2 md:p-4 border-b my-4" id="sign-out">
      <div className="w-full px-6 pb-8 mt-8 sm:max-w-xl sm:rounded-lg">
        <h2 className="pl-6 text-2xl font-bold sm:text-xl mb-4">Sign Out</h2>
        <p className="mb-3 text-base text-gray-800">
          Ready to leave our service? You can sign out here. This action will
          log you out of your account. Remember, you can always sign in again
          later.
        </p>

        <button
          onClick={() =>
            download_survey_data
              ? setShowPopup((prev) => !prev)
              : handleLogout()
          }
          className=" text-white bg-gradient-to-br from-red-500 to-red-800 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
        >
          Sign Out
        </button>
      </div>
      <LogOutPopupModal
        showFilter={showPopup}
        closeModal={() => setShowPopup(!showPopup)}
      />
    </div>
  );
};

export default UserSignOut;

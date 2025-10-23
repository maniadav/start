"use client";
import toast from "react-hot-toast";
import { useState } from "react";
import { FaEnvelope, FaSpinner, FaCheckCircle } from "react-icons/fa";
import PopupContainter from "./PopupContainter";
import startUtilityAPI from "@services/start.utility";

interface ManagementActivationPopupProps {
  showFilter: boolean;
  closeModal: any;
  onSuccess?: () => void;
  user_id: string;
  user_name: string;
  user_email: string;
  role: "organisation" | "observer";
}

const ManagementActivationPopup = ({
  showFilter,
  closeModal,
  onSuccess,
  user_id,
  user_name,
  user_email,
  role = "organisation",
}: ManagementActivationPopupProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    try {
      const response = await startUtilityAPI.auth.sendActivationMail(user_id);

      if (response.success === true) {
        toast.success(`Activation email sent successfully to ${user_name}`);
        // if (onSuccess) {
        //   onSuccess();
        // }
      } else {
        console.error("Response success is not true:", response);
        throw new Error(
          response.message ||
            response.data?.message ||
            "Failed to send activation email hihi"
        );
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        `Failed to send activation email to ${user_name}`;
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
      closeModal();
    }
  };

  return (
    <PopupContainter>
      <div className="relative bg-white rounded-xl shadow-2xl p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <FaEnvelope className="w-8 h-8 text-primary shrink-0" />
          <div className="flex flex-col gap-1 w-full">
            <h3 className="text-2xl font-bold text-gray-900 capitalize">{`Send Activation Email`}</h3>
            <p className="text-gray-600 mt-1 text-base md:text-sm">
              Send verification email to {user_name}
            </p>
          </div>
        </div>

        {/* Information Message */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
          <p className="text-yellow-700 font-medium">
            This will send a verification email to {user_name} ({user_email}) to
            activate their {role} account. The email will contain a verification
            link that expires in 24 hours.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 pt-2">
          <button
            onClick={closeModal}
            className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="px-5 py-2.5 bg-primary hover:bg-blue-700 text-white font-medium rounded-lg transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <FaSpinner className="w-4 h-4 animate-spin" />
                Sending Email...
              </>
            ) : (
              <>
                <FaEnvelope className="w-4 h-4" />
                Send Activation Email
              </>
            )}
          </button>
        </div>
      </div>
    </PopupContainter>
  );
};

export default ManagementActivationPopup;

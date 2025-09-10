"use client";
import { useToast } from "@management/hooks/use-toast";
import StartUtilityAPI from "@services/start.utility";
import { PopupModal } from "@components/ui/PopupModal";
import { useMemo, useState } from "react";
import { FaBuilding, FaSpinner } from "react-icons/fa";
import PopupContainter from "./PopupContainter";
import startUtilityAPI from "@services/start.utility";

interface DeleteOrganisationPopupProps {
  showFilter: boolean;
  closeModal: any;
  onSuccess?: () => void;
  organisation_id: string;
}

// Not needed for delete operation

const DeleteOrganisationPopup = ({
  showFilter,
  closeModal,
  onSuccess,
  organisation_id,
}: DeleteOrganisationPopupProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await startUtilityAPI.organisation.delete(
        organisation_id
      );

      console.log("Parsed result:", response);

      if (onSuccess) {
        console.log("Calling onSuccess...");
        onSuccess();
        console.log("onSuccess called successfully");
      } else {
        console.log("onSuccess is not provided or falsy");
      }
      toast({
        title: "Success",
        description: "Organisation deleted successfully",
      });
    } catch (error) {
      console.error("Error creating organisation:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to create organisation",
      });
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
          <FaBuilding className="w-8 h-8 text-red-600 shrink-0" />
          <div className="flex flex-col gap-1 w-full">
            <h3 className="text-2xl font-bold text-gray-900">
              Delete Organisation
            </h3>
            <p className="text-gray-600 mt-1 text-base md:text-sm">
              This action cannot be undone
            </p>
          </div>
        </div>

        {/* Warning Message */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <div className="flex justify-center mb-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h4 className="text-lg font-semibold text-red-700 mb-2">
            Warning: Permanent Deletion
          </h4>
          <p className="text-red-600 mb-2">
            Deleting this organisation will also permanently delete:
          </p>
          <ul className="text-sm text-red-600 mb-3 list-disc list-inside">
            <li>All associated observers</li>
            <li>All related child records</li>
            <li>All data linked to this organisation</li>
          </ul>
          <p className="text-red-700 font-medium">
            This action cannot be reversed. Are you absolutely sure?
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
            className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-all flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <FaSpinner className="w-4 h-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>Delete Organisation</>
            )}
          </button>
        </div>
      </div>
    </PopupContainter>
  );
};

export default DeleteOrganisationPopup;

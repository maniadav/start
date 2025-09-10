"use client";
import { PopupModal } from "@components/ui/PopupModal";
import { Building2, Loader2 } from "lucide-react";

interface ManagementPopupProps {
  showFilter: boolean;
  closeModal: () => void;
  children: React.ReactNode;
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  isLoading?: boolean;
  actionLabel?: string;
  onAction?: () => void;
  actionIcon?: React.ReactNode;
}

const ManagementPopup = ({
  showFilter,
  closeModal,
  children,
  icon,
  title,
  description,
  isLoading = false,
  actionLabel = "Submit",
  onAction,
  actionIcon,
}: ManagementPopupProps) => {
  return (
    <PopupModal
      show={showFilter}
      slideBottom={true}
      onRequestClose={closeModal}
    >
      <div className="relative bg-white rounded-xl shadow-2xl p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 text-primary shrink-0 flex items-center justify-center">
            {icon ? icon : <Building2 size={32} />}
          </span>
          <div className="flex flex-col gap-1 w-full">
            {title && (
              <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
            )}
            {description && (
              <p className="text-gray-600 mt-1 text-base md:text-sm">
                {description}
              </p>
            )}
          </div>
        </div>
        <div>{children}</div>
        <div className="flex flex-col md:flex-row justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={closeModal}
            className="px-5 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors w-full md:w-auto"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onAction}
            className="px-5 py-2.5 text-white bg-primary hover:bg-primary rounded-lg font-medium transition-colors flex items-center gap-2 w-full md:w-auto justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Loading...
              </>
            ) : (
              <>
                {actionIcon ? actionIcon : <Building2 size={20} />}
                {actionLabel}
              </>
            )}
          </button>
        </div>
      </div>
    </PopupModal>
  );
};

export default ManagementPopup;

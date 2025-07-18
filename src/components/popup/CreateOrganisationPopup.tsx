"use client";
import { API_ENDPOINT } from "@constants/api.constant";
import { useToast } from "@management/hooks/use-toast";
import StartUtilityAPI from "@services/start.utility";
import { PopupModal } from "components/common/PopupModal";
import { useMemo, useState } from "react";
import { FaBuilding, FaEnvelope, FaUser, FaSpinner } from "react-icons/fa";
import { start } from "repl";

interface CreateOrganisationPopupProps {
  showFilter: boolean;
  closeModal: any;
  onSuccess?: () => void;
}

interface OrganisationFormData {
  name: string;
  email: string;
  address: string;
}

const CreateOrganisationPopup = ({
  showFilter,
  closeModal,
  onSuccess,
}: CreateOrganisationPopupProps) => {
  const [formData, setFormData] = useState<OrganisationFormData>({
    name: "",
    email: "",
    address: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<OrganisationFormData>>({});
  const startApi = useMemo(() => new StartUtilityAPI(), []);
  const { toast } = useToast();
  const validateForm = (): boolean => {
    const newErrors: Partial<OrganisationFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Organisation name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)
    ) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    field: keyof OrganisationFormData,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await startApi.organisation.create(formData);
      const result = await response.json();

      setFormData({ name: "", email: "", address: "" });
      setErrors({});
      onSuccess ? onSuccess() : null;
      toast.info({
        title: "Information",
        description: "Your session expires in 5 minutes",
        position: "tl", // top-left
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
    <PopupModal
      show={showFilter}
      slideBottom={true}
      onRequestClose={closeModal}
    >
      <div className="fixed right-0 top-0 inset-0 w-full h-full flex items-center justify-center overflow-y-auto bg-black bg-opacity-50 backdrop-blur-sm z-[1000]">
        <div className="relative p-4 w-full max-w-xl max-h-full">
          <div className="relative bg-white rounded-xl shadow-2xl p-8 space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
              <FaBuilding className="w-8 h-8 text-primary shrink-0" />
              <div className="flex flex-col gap-1 w-full">
                <h3 className="text-2xl font-bold text-gray-900">
                  Create Organisation
                </h3>
                <p className="text-gray-600 mt-1 text-base md:text-sm">
                  Add a new organisation to the system
                </p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Organisation Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Organisation Name *
                </label>
                <div className="relative">
                  <FaBuilding className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                      errors.name ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter organisation name"
                    disabled={isLoading}
                  />
                </div>
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email Address *
                </label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter email address"
                    disabled={isLoading}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Address */}
              <div>
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Address *
                </label>
                <textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  rows={3}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                    errors.address ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter organisation address"
                  disabled={isLoading}
                />
                {errors.address && (
                  <p className="mt-1 text-sm text-red-600">{errors.address}</p>
                )}
              </div>

              {/* Action Buttons */}
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
                  type="submit"
                  className="px-5 py-2.5 text-white bg-primary hover:bg-primary rounded-lg font-medium transition-colors flex items-center gap-2 w-full md:w-auto justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <FaBuilding />
                      Create Organisation
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </PopupModal>
  );
};

export default CreateOrganisationPopup;

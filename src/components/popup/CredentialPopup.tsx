"use client";
import { useToast } from "@management/hooks/use-toast";
import { useState } from "react";
import { FaBuilding, FaSpinner } from "react-icons/fa";
import PopupContainter from "./PopupContainter";

interface CredentialPopupProps {
  showFilter: boolean;
  closeModal: any;
  onSuccess?: () => void;
}

interface CredentialFormData {
  organisation_id: string;
  aws_access_key: string;
  aws_secret_access_key: string;
  aws_bucket_name: string;
  aws_bucket_region: string;
}

const CredentialPopup = ({
  showFilter,
  closeModal,
  onSuccess,
}: CredentialPopupProps) => {
  const [formData, setFormData] = useState<CredentialFormData>({
    organisation_id: "",
    aws_access_key: "",
    aws_secret_access_key: "",
    aws_bucket_name: "",
    aws_bucket_region: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<CredentialFormData>>({});
  const { toast } = useToast();
  const validateForm = (): boolean => {
    const newErrors: Partial<CredentialFormData> = {};
    if (!formData.organisation_id.trim()) {
      newErrors.organisation_id = "Organisation ID is required";
    }
    if (!formData.aws_access_key.trim()) {
      newErrors.aws_access_key = "AWS Access Key is required";
    }
    if (!formData.aws_secret_access_key.trim()) {
      newErrors.aws_secret_access_key = "AWS Secret Access Key is required";
    }
    if (!formData.aws_bucket_name.trim()) {
      newErrors.aws_bucket_name = "AWS Bucket Name is required";
    }
    if (!formData.aws_bucket_region.trim()) {
      newErrors.aws_bucket_region = "AWS Bucket Region is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    field: keyof CredentialFormData,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
      // Call credential API route
      const response = await fetch("/api/v1/credentials/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save credentials");
      }
      setFormData({
        organisation_id: "",
        aws_access_key: "",
        aws_secret_access_key: "",
        aws_bucket_name: "",
        aws_bucket_region: "",
      });
      setErrors({});
      if (onSuccess) onSuccess();
      toast({
        title: "Success",
        description: "AWS credentials saved successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to save credentials",
      });
    } finally {
      setIsLoading(false);
      closeModal();
    }
  };

  return (
    <PopupContainter>
      {" "}
      <div className="relative bg-white rounded-xl shadow-2xl p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <FaBuilding className="w-8 h-8 text-primary shrink-0" />
          <div className="flex flex-col gap-1 w-full">
            <h3 className="text-2xl font-bold text-gray-900">Add Credential</h3>
            <p className="text-gray-600 mt-1 text-base md:text-sm">
              Add a new credential to the system
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Organisation ID */}
          <div>
            <label
              htmlFor="organisation_id"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Organisation ID *
            </label>
            <input
              type="text"
              id="organisation_id"
              value={formData.organisation_id}
              onChange={(e) =>
                handleInputChange("organisation_id", e.target.value)
              }
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                errors.organisation_id ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter organisation ID"
              disabled={isLoading}
            />
            {errors.organisation_id && (
              <p className="mt-1 text-sm text-red-600">
                {errors.organisation_id}
              </p>
            )}
          </div>

          {/* AWS Access Key */}
          <div>
            <label
              htmlFor="aws_access_key"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              AWS Access Key *
            </label>
            <input
              type="text"
              id="aws_access_key"
              value={formData.aws_access_key}
              onChange={(e) =>
                handleInputChange("aws_access_key", e.target.value)
              }
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                errors.aws_access_key ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter AWS Access Key"
              disabled={isLoading}
            />
            {errors.aws_access_key && (
              <p className="mt-1 text-sm text-red-600">
                {errors.aws_access_key}
              </p>
            )}
          </div>

          {/* AWS Secret Access Key */}
          <div>
            <label
              htmlFor="aws_secret_access_key"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              AWS Secret Access Key *
            </label>
            <input
              type="password"
              id="aws_secret_access_key"
              value={formData.aws_secret_access_key}
              onChange={(e) =>
                handleInputChange("aws_secret_access_key", e.target.value)
              }
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                errors.aws_secret_access_key
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              placeholder="Enter AWS Secret Access Key"
              disabled={isLoading}
            />
            {errors.aws_secret_access_key && (
              <p className="mt-1 text-sm text-red-600">
                {errors.aws_secret_access_key}
              </p>
            )}
          </div>

          {/* AWS Bucket Name */}
          <div>
            <label
              htmlFor="aws_bucket_name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              AWS Bucket Name *
            </label>
            <input
              type="text"
              id="aws_bucket_name"
              value={formData.aws_bucket_name}
              onChange={(e) =>
                handleInputChange("aws_bucket_name", e.target.value)
              }
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                errors.aws_bucket_name ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter AWS Bucket Name"
              disabled={isLoading}
            />
            {errors.aws_bucket_name && (
              <p className="mt-1 text-sm text-red-600">
                {errors.aws_bucket_name}
              </p>
            )}
          </div>

          {/* AWS Bucket Region */}
          <div>
            <label
              htmlFor="aws_bucket_region"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              AWS Bucket Region *
            </label>
            <input
              type="text"
              id="aws_bucket_region"
              value={formData.aws_bucket_region}
              onChange={(e) =>
                handleInputChange("aws_bucket_region", e.target.value)
              }
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                errors.aws_bucket_region ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter AWS Bucket Region"
              disabled={isLoading}
            />
            {errors.aws_bucket_region && (
              <p className="mt-1 text-sm text-red-600">
                {errors.aws_bucket_region}
              </p>
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
    </PopupContainter>
  );
};

export default CredentialPopup;

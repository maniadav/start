"use client";
import { useToast } from "@management/hooks/use-toast";
import StartUtilityAPI from "@services/start.utility";
import { PopupModal } from "@components/ui/PopupModal";
import { useMemo, useState } from "react";
import { FaBuilding, FaEnvelope, FaUser, FaSpinner } from "react-icons/fa";
import PopupContainter from "./PopupContainter";
import startUtilityAPI from "@services/start.utility";

interface CredentialPopupProps {
  showFilter: boolean;
  closeModal: any;
  onSuccess?: () => void;
  organisationId: string;
}

interface CredentialFormData {
  awsAccessKey: string;
  awsSecretAccessKey: string;
  awsBucketName: string;
  awsBucketRegion: string;
  organisationId: string;
}

const CredentialPopup = ({
  showFilter,
  closeModal,
  onSuccess,
  organisationId,
}: CredentialPopupProps) => {
  const [formData, setFormData] = useState<CredentialFormData>({
    organisationId: organisationId || "",
    awsAccessKey: "",
    awsSecretAccessKey: "",
    awsBucketName: "",
    awsBucketRegion: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<CredentialFormData>>({});

  const { toast } = useToast();
  const validateForm = (): boolean => {
    const newErrors: Partial<CredentialFormData> = {};
    if (!formData.organisationId.trim()) {
      newErrors.organisationId = "Organisation ID is required";
    }
    if (!formData.awsAccessKey.trim()) {
      newErrors.awsAccessKey = "AWS Access Key is required";
    }
    if (!formData.awsSecretAccessKey.trim()) {
      newErrors.awsSecretAccessKey = "AWS Secret Access Key is required";
    }
    if (!formData.awsBucketName.trim()) {
      newErrors.awsBucketName = "AWS Bucket Name is required";
    }
    if (!formData.awsBucketRegion.trim()) {
      newErrors.awsBucketRegion = "AWS Bucket Region is required";
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
      const res = await startUtilityAPI.credential.create(formData);
      console.log("Credential response:", res);
      if (!res) {
        throw new Error("Failed to save credentials");
      }
      setFormData({
        organisationId: "",
        awsAccessKey: "",
        awsSecretAccessKey: "",
        awsBucketName: "",
        awsBucketRegion: "",
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
              htmlFor="organisationId"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Organisation ID *
            </label>
            <input
              type="text"
              id="organisationId"
              value={formData.organisationId}
              onChange={(e) =>
                handleInputChange("organisationId", e.target.value)
              }
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                errors.organisationId ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter organisation ID"
              disabled={isLoading}
            />
            {errors.organisationId && (
              <p className="mt-1 text-sm text-red-600">
                {errors.organisationId}
              </p>
            )}
          </div>

          {/* AWS Access Key */}
          <div>
            <label
              htmlFor="awsAccessKey"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              AWS Access Key *
            </label>
            <input
              type="text"
              id="awsAccessKey"
              value={formData.awsAccessKey}
              onChange={(e) =>
                handleInputChange("awsAccessKey", e.target.value)
              }
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                errors.awsAccessKey ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter AWS Access Key"
              disabled={isLoading}
            />
            {errors.awsAccessKey && (
              <p className="mt-1 text-sm text-red-600">{errors.awsAccessKey}</p>
            )}
          </div>

          {/* AWS Secret Access Key */}
          <div>
            <label
              htmlFor="awsSecretAccessKey"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              AWS Secret Access Key *
            </label>
            <input
              type="password"
              id="awsSecretAccessKey"
              value={formData.awsSecretAccessKey}
              onChange={(e) =>
                handleInputChange("awsSecretAccessKey", e.target.value)
              }
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                errors.awsSecretAccessKey ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter AWS Secret Access Key"
              disabled={isLoading}
            />
            {errors.awsSecretAccessKey && (
              <p className="mt-1 text-sm text-red-600">
                {errors.awsSecretAccessKey}
              </p>
            )}
          </div>

          {/* AWS Bucket Name */}
          <div>
            <label
              htmlFor="awsBucketName"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              AWS Bucket Name *
            </label>
            <input
              type="text"
              id="awsBucketName"
              value={formData.awsBucketName}
              onChange={(e) =>
                handleInputChange("awsBucketName", e.target.value)
              }
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                errors.awsBucketName ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter AWS Bucket Name"
              disabled={isLoading}
            />
            {errors.awsBucketName && (
              <p className="mt-1 text-sm text-red-600">
                {errors.awsBucketName}
              </p>
            )}
          </div>

          {/* AWS Bucket Region */}
          <div>
            <label
              htmlFor="awsBucketRegion"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              AWS Bucket Region *
            </label>
            <input
              type="text"
              id="awsBucketRegion"
              value={formData.awsBucketRegion}
              onChange={(e) =>
                handleInputChange("awsBucketRegion", e.target.value)
              }
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                errors.awsBucketRegion ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter AWS Bucket Region"
              disabled={isLoading}
            />
            {errors.awsBucketRegion && (
              <p className="mt-1 text-sm text-red-600">
                {errors.awsBucketRegion}
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

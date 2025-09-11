"use client";
import { useState } from "react";
import { FaBuilding, FaEnvelope, FaUser, FaSpinner } from "react-icons/fa";
import PopupContainter from "./PopupContainter";
import startUtilityAPI from "@services/start.utility";
import toast from "react-hot-toast";

interface CreateManagementPopupProps {
  showFilter: boolean;
  closeModal: any;
  onSuccess?: () => void;
  role: "organisation" | "observer";
}

interface IManagementForm {
  name: string;
  email: string;
  address: string;
}

const ManagementCreatePopup = ({
  showFilter,
  closeModal,
  onSuccess,
  role = "organisation",
}: CreateManagementPopupProps) => {
  const [formData, setFormData] = useState<IManagementForm>({
    name: "",
    email: "",
    address: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<IManagementForm>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<IManagementForm> = {};

    if (!formData.name.trim()) {
      newErrors.name = `${role} name is required`;
    }

    if (!formData.email.trim()) {
      newErrors.email = `${role} email is required`;
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

  const handleInputChange = (field: keyof IManagementForm, value: string) => {
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
      const response =
        role === "observer"
          ? await startUtilityAPI.observer.create(formData)
          : await startUtilityAPI.organisation.create(formData);
      console.log("Create response:", response);

      setFormData({ name: "", email: "", address: "" });
      setErrors({});
      console.log("onSuccess is function:", typeof onSuccess === "function");
      if (onSuccess) {
        console.log("Calling onSuccess...");
        onSuccess();
        console.log("onSuccess called successfully");
      } else {
        console.log("onSuccess is not provided or falsy");
      }

      toast.success(`${role} created successfully`);
    } catch (_error) {
      toast.error(`Failed to create ${role}`);
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
          <FaBuilding className="w-8 h-8 text-primary shrink-0" />
          <div className="flex flex-col gap-1 w-full">
            <h3 className="text-2xl font-bold text-gray-900 capitalize">
              {`Create ${role}`}
            </h3>
            <p className="text-gray-600 mt-1 text-base md:text-sm">
              {`Add a new ${role} to the system`}
            </p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-2 capitalize"
            >
              {`${role} name *`}
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
                placeholder={`Enter ${role} name`}
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
              className="block text-sm font-medium text-gray-700 mb-2 capitalize"
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
              className="block text-sm font-medium text-gray-700 mb-2 capitalize"
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
              placeholder="Enter address"
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
              className="capitalize px-5 py-2.5 text-white bg-primary hover:bg-primary rounded-lg font-medium transition-colors flex items-center gap-2 w-full md:w-auto justify-center disabled:opacity-50 disabled:cursor-not-allowed"
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
                  {`Create ${role}`}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </PopupContainter>
  );
};

export default ManagementCreatePopup;

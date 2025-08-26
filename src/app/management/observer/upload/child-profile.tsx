import React from "react";
import {
  User,
  Key,
  Calendar,
  Heart,
  MapPin,
  Eye,
  Building2,
} from "lucide-react";

const ChildProfile = ({ user }: { user: any }) => {
  
  return (
    <div className="w-full">
      <div className="grid grid-cols-2 gap-6">
        {/* Child Name Display */}
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">
                Star&apos;s Name
              </p>
              <p className="text-lg font-semibold text-gray-900">
                {user.childName || "Not provided"}
              </p>
            </div>
          </div>
        </div>

        {/* Child ID Display */}
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Key className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">
                Star&apos;s ID
              </p>
              <p className="text-lg font-semibold text-gray-900 font-mono">
                {user.childId || "Not generated"}
              </p>
            </div>
          </div>
        </div>

        {/* Child DOB Display */}
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Calendar className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Date of Birth</p>
              <p className="text-lg font-semibold text-gray-900">
                {user.childDob
                  ? new Date(user.childDob).toLocaleDateString()
                  : "Not provided"}
              </p>
            </div>
          </div>
        </div>

        {/* Child Gender Display */}
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Heart className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Gender</p>
              <p className="text-lg font-semibold text-gray-900">
                {user.childGender === "male"
                  ? "Prince (Male)"
                  : user.childGender === "female"
                  ? "Princess (Female)"
                  : user.childGender === "other"
                  ? "Unique Star (Other)"
                  : "Not specified"}
              </p>
            </div>
          </div>
        </div>

        {/* Child Address Display */}
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 col-span-2">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <MapPin className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">
                Star&apos;s Address
              </p>
              <p className="text-lg font-semibold text-gray-900">
                {user.childAddress || "Not provided"}
              </p>
            </div>
          </div>
        </div>

        {/* Observer ID Display */}
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Eye className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Observer ID</p>
              <p className="text-lg font-semibold text-gray-900 font-mono">
                {user.observerId || "Not available"}
              </p>
            </div>
          </div>
        </div>

        {/* Organisation ID Display */}
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Building2 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">
                Organisation ID
              </p>
              <p className="text-lg font-semibold text-gray-900 font-mono">
                {user.organisationId || "Not available"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <p className="mt-6 text-xs text-gray-600 text-center">
        By proceeding, you agree to our{" "}
        <a href="#" className="border-b border-gray-500 border-dotted">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className="border-b border-gray-500 border-dotted">
          Privacy Policy
        </a>
        .
      </p>
    </div>
  );
};

export default ChildProfile;

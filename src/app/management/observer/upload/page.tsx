"use client";
import { SidebarTriggerComp } from "@management/SidebarTrigger";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "components/ui/card";
import Upload from "./Upload";
import {
  Tabs,
  TabsTrigger,
  TabsList,
  TabsContent,
} from "@management/components/ui/tabs";
import { useAuth } from "state/provider/AuthProvider";
import { AlertTriangle } from "lucide-react";
import ChildProfile from "./child-profile";

const UploadPage = () => {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <div className="p-4 md:p-8">
      <SidebarTriggerComp title="Uplaod Files" />

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Child Information
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Warning Message */}
          <div className="w-full">
            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
              <div className="flex items-center">
                <AlertTriangle className="h-6 w-6 text-red-400" />
                <div className="ml-3">
                  <p className="text-sm text-red-700 font-medium">
                    <strong>WARNING:</strong>{" "}
                    {`upload the files you have downloaded`}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <ChildProfile user={user} />

          {/* Tabs Section */}
          <Tabs defaultValue="upload-files" className="w-full">
            <TabsList className="grid w-full grid-cols-3 gap-2">
              <TabsTrigger value="upload-files">Upload Own Files</TabsTrigger>
              <TabsTrigger value="recorded-data">
                Upload from Current Recorded Data
              </TabsTrigger>
              <TabsTrigger value="file-records">File Records</TabsTrigger>
            </TabsList>

            <TabsContent value="upload-files" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Upload Files</CardTitle>
                  <CardDescription>
                    Upload JSON or CSV files for your tasks. Files will be
                    automatically associated with tasks based on their names.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>zip upload section</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="recorded-data" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recorded Data</CardTitle>
                  <CardDescription>
                    Upload files from current recorded data sessions.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Upload user={user} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="file-records" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>File Records</CardTitle>
                  <CardDescription>
                    View and manage all uploaded files with download options.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>File records table</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default UploadPage;

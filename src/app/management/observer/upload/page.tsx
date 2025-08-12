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

const UploadPage = () => {
  return (
    <div className="p-4 md:p-8">
      <SidebarTriggerComp title="Uplaod Files" />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4 mt-4 rounded">
              <div className="flex items-center">
                <svg
                  className="h-6 w-6 text-red-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <div className="ml-3">
                  <p className="text-sm text-red-700 font-medium">
                    <strong>WARNING:</strong>{" "}
                    {`upload the files you have downloaded`}
                  </p>
                </div>
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
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
                  <Upload />
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

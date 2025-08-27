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
import { Tabs, TabsTrigger, TabsList, TabsContent } from "@components/ui/tabs";
import { useAuth } from "state/provider/AuthProvider";
import { AlertTriangle } from "lucide-react";
import ChildProfile from "./child-profile";
import UploadData from "./upload-data";

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
            <div className="w-full">
              <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
                <div className="flex items-center">
                  <AlertTriangle className="h-6 w-6 text-red-400" />
                  <div className="ml-3">
                    <p className="text-sm text-red-700 font-medium">
                      <strong>WARNING:</strong>{" "}
                      {`please upload the files you have downloaded for the below child`}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <ChildProfile user={user} />

          {/* Tabs Section */}
          <Tabs defaultValue="file-records" className="w-full">
            <TabsList className="grid w-full grid-cols-2 gap-2">
              <TabsTrigger value="recorded-data">
                Upload from Current Recorded Data
              </TabsTrigger>
              <TabsTrigger value="file-records">File Records</TabsTrigger>
            </TabsList>

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
                  <CardTitle>Survey Recorded Data</CardTitle>
                  <CardDescription className="text-primary">
                    You may upload the conducted survey data
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <UploadData user={user} />
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

"use client";
import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";
import SidebarTrigger from "@management/SidebarTrigger";
import { useEffect, useMemo, useState } from "react";
import LoadingSection from "components/section/loading-section";
import StartUtilityAPI from "@services/start.utility";
import { FileTable } from "app/management/admin/file/FileTable";

const ObserverFilesPage = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = React.useCallback(async () => {
    setLoading(true);
    try {
      console.log("Loading organisations...");
      const START_API = new StartUtilityAPI();

      const res = await START_API.files.list();
      setData(res.data || []);
      console.log("files data", res.data?.length || 0);
    } catch (error) {
      console.error("Failed to load files:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center space-x-2">
        <SidebarTrigger />
        <h2 className="text-3xl font-bold tracking-tight">
          All Uploaded Files
        </h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>File Management</CardTitle>
        </CardHeader>
        <CardContent className="w-auto overflow-x-scroll">
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <LoadingSection />
            </div>
          ) : (
            <FileTable data={data} />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ObserverFilesPage;

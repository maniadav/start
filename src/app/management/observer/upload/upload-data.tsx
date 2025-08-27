"use client";
import type React from "react";
import { useState } from "react";
import {
  FiCheckCircle,
  FiAlertCircle,
  FiFile,
  FiDownload,
} from "react-icons/fi";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card";
import TASK_TYPE from "@constants/survey.type.constant";
import Button from "components/common/Button";
import { useToast } from "@management/hooks/use-toast";
import StartUtilityAPI from "@services/start.utility";
import { useSurveyContext } from "state/provider/SurveytProvider";

interface TaskData {
  assessment_id: string;
  noOfAttempt: number;
  attempt1: any;
  attempt2: any;
  attempt3: any;
  userId: string;
  userDob: string;
  userGender: string;
  observerId: string;
}

export default function UploadData({ user }: { user: any }) {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [uploadingTasks, setUploadingTasks] = useState<Record<string, boolean>>(
    {}
  );
  const [uploadedTasks, setUploadedTasks] = useState<Record<string, boolean>>(
    {}
  );
  const { state } = useSurveyContext();

  // Convert JSON data to CSV format
  const jsonToCsv = (jsonData: any, fileName: string = "data.csv"): string => {
    // Initialize headers and rows
    const headers = new Set<string>();
    const rows: Record<string, any>[] = [];

    // Recursive function to process the JSON object
    function processKey(key: string, value: any) {
      if (
        typeof value === "string" ||
        typeof value === "number" ||
        typeof value === "boolean" ||
        value === null ||
        value === undefined ||
        value === 0
      ) {
        // Add as a single column
        if (!rows[0]) rows[0] = {};
        rows[0][key] = value;
        headers.add(key);
      } else if (Array.isArray(value)) {
        // Populate them vertically
        headers.add(key);
        value.forEach((val, index) => {
          if (!rows[index]) rows[index] = {};
          rows[index][key] = val;
        });
      } else if (typeof value === "object" && value !== null) {
        // If value is an object, process its keys
        Object.keys(value).forEach((nestedKey) => {
          processKey(`${key}_${nestedKey}`, value[nestedKey]);
        });
      }
    }

    // Process each key in the JSON data
    Object.entries(jsonData).forEach(([key, value]) => {
      processKey(key, value);
    });

    // Generate CSV content
    const headerList = Array.from(headers);
    const csvContent = [
      headerList.join(","),
      ...rows.map((row) =>
        headerList
          .map((header) =>
            row[header] === undefined || row[header] === null
              ? '""'
              : `"${row[header]}"`
          )
          .join(",")
      ),
    ].join("\n");

    return csvContent;
  };

  // Create CSV file from task data
  const createCSVFile = (taskData: TaskData, taskType: string): File => {
    const csvContent = jsonToCsv(taskData, `${taskType}.csv`);
    const csvBlob = new Blob([csvContent], { type: "text/csv" });

    // Create filename with timestamp
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0];
    const fileName = `${taskType}_${user.childId}_${user.observerId}_${formattedDate}.csv`;

    return new File([csvBlob], fileName, { type: "text/csv" });
  };

  // Upload a single task's CSV file
  const uploadTask = async (taskType: string) => {
    const taskData = state[taskType] as TaskData;

    if (!taskData) {
      toast({
        variant: "destructive",
        title: "No Data Available",
        description: `No data found for ${taskType}`,
      });
      return;
    }

    // Check if task has any meaningful data
    const hasData =
      (taskData.attempt1 && Object.keys(taskData.attempt1).length > 0) ||
      (taskData.attempt2 && Object.keys(taskData.attempt2).length > 0) ||
      (taskData.attempt3 && Object.keys(taskData.attempt3).length > 0);

    if (!hasData) {
      toast({
        variant: "destructive",
        title: "No Data Available",
        description: `No attempt data found for ${taskType}`,
      });
      return;
    }

    // Set individual task loading state
    setUploadingTasks((prev) => ({ ...prev, [taskType]: true }));

    try {
      // Create CSV file from task data
      const csvFile = createCSVFile(taskData, taskType);

      // Extract user metadata for the upload
      const { organisationId, childId } = user;

      if (!organisationId || !childId) {
        toast({
          variant: "destructive",
          title: "Upload Failed",
          description:
            "Missing required user metadata (organisationId or childId)",
        });
        return;
      }

      const formData = new FormData();
      formData.append("file", csvFile);
      formData.append("title", csvFile.name);
      formData.append("taskId", taskType);
      formData.append("childId", childId);
      formData.append("organisationId", organisationId);

      // Use StartUtilityAPI to upload the file
      const START_API = new StartUtilityAPI();
      const result = await START_API.files.upload(formData);

      console.log(`Task ${taskType} uploaded successfully:`, result);

      setUploadedTasks((prev) => ({
        ...prev,
        [taskType]: true,
      }));

      toast({
        title: "Task Upload Complete",
        description: `${taskType} data uploaded successfully`,
      });
    } catch (error) {
      console.error(`Failed to upload ${taskType}:`, error);
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: `${taskType}: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      });
    } finally {
      // Clear individual task loading state
      setUploadingTasks((prev) => ({ ...prev, [taskType]: false }));
    }
  };

  // Bulk upload all tasks
  const uploadAllTasks = async () => {
    const tasksWithData = TASK_TYPE.filter((taskType) => {
      const taskData = state[taskType] as TaskData;
      if (!taskData) return false;

      return (
        (taskData.attempt1 && Object.keys(taskData.attempt1).length > 0) ||
        (taskData.attempt2 && Object.keys(taskData.attempt2).length > 0) ||
        (taskData.attempt3 && Object.keys(taskData.attempt3).length > 0)
      );
    });

    if (tasksWithData.length === 0) {
      toast({
        variant: "destructive",
        title: "No Data Available",
        description: "No tasks have data to upload",
      });
      return;
    }

    setUploading(true);

    try {
      const results = await Promise.all(tasksWithData.map(uploadTask));
      const successCount = results.filter(Boolean).length;

      toast({
        title: "Bulk Upload Complete",
        description: `${successCount}/${tasksWithData.length} tasks uploaded successfully`,
      });
    } finally {
      setUploading(false);
    }
  };

  // Download CSV file locally (for preview/testing)
  const downloadTaskCSV = (taskType: string) => {
    const taskData = state[taskType] as TaskData;

    if (!taskData) {
      toast({
        variant: "destructive",
        title: "No Data Available",
        description: `No data found for ${taskType}`,
      });
      return;
    }

    const csvContent = jsonToCsv(taskData, `${taskType}.csv`);
    const csvBlob = new Blob([csvContent], { type: "text/csv" });
    const csvLink = document.createElement("a");
    csvLink.href = URL.createObjectURL(csvBlob);

    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0];
    const fileName = `${taskType}_${user.childId}_${user.observerId}_${formattedDate}.csv`;

    csvLink.download = fileName;
    csvLink.click();

    toast({
      title: "Download Complete",
      description: `${taskType} data downloaded as CSV`,
    });
  };

  // Check if user has required metadata
  const hasRequiredMetadata = user?.organisationId && user?.childId;

  // Get task status
  const getTaskStatus = (taskType: string) => {
    const taskData = state[taskType] as TaskData;
    if (!taskData) return { hasData: false, attemptCount: 0 };

    const attempts = [taskData.attempt1, taskData.attempt2, taskData.attempt3];
    const attemptCount = attempts.filter(
      (attempt) => attempt && Object.keys(attempt).length > 0
    ).length;

    return {
      hasData: attemptCount > 0,
      attemptCount,
    };
  };

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Tasks List */}
      <Card>
        <CardHeader>
          <CardTitle>Task Data Upload</CardTitle>
          <CardDescription>
            Convert and upload task data as CSV files to the server. Each task
            button will convert the JSON data to CSV format and upload it.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {TASK_TYPE.map((taskType) => {
              const taskStatus = getTaskStatus(taskType);
              const isUploaded = uploadedTasks[taskType];

              return (
                <div
                  key={taskType}
                  className="flex items-center justify-between p-4 border rounded-md"
                >
                  <div className="flex items-center gap-3">
                    {isUploaded ? (
                      <FiCheckCircle className="h-5 w-5 text-green-500" />
                    ) : taskStatus.hasData ? (
                      <FiFile className="h-5 w-5 text-primary" />
                    ) : (
                      <FiAlertCircle className="h-5 w-5 text-muted-foreground" />
                    )}
                    <div>
                      <p className="font-medium">{taskType}</p>
                      <p className="text-sm text-muted-foreground">
                        {isUploaded
                          ? "Uploaded to server"
                          : taskStatus.hasData
                          ? `${taskStatus.attemptCount} attempt(s) available`
                          : "No data available"}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {taskStatus.hasData && !isUploaded && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadTaskCSV(taskType)}
                        disabled={uploading || uploadingTasks[taskType]}
                      >
                        <FiDownload className="h-4 w-4 mr-1" />
                        Preview
                      </Button>
                    )}
                    <Button
                      variant={
                        taskStatus.hasData && !isUploaded
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                      disabled={
                        !taskStatus.hasData ||
                        uploading ||
                        uploadingTasks[taskType] ||
                        isUploaded ||
                        !hasRequiredMetadata
                      }
                      onClick={() => uploadTask(taskType)}
                    >
                      {isUploaded
                        ? "Uploaded"
                        : uploadingTasks[taskType]
                        ? "Uploading..."
                        : "Upload"}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={uploadAllTasks}
            disabled={uploading || !hasRequiredMetadata}
            className="w-full"
          >
            {uploading
              ? "Uploading All Tasks..."
              : "Upload All Available Tasks"}
          </Button>
        </CardFooter>
      </Card>

      {/* Data Summary */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Data Summary</CardTitle>
          <CardDescription>
            Overview of available task data and upload status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {TASK_TYPE.map((taskType) => {
              const taskStatus = getTaskStatus(taskType);
              const isUploaded = uploadedTasks[taskType];

              return (
                <div
                  key={taskType}
                  className="text-center p-3 border rounded-md"
                >
                  <p className="font-medium text-sm">{taskType}</p>
                  <p className="text-2xl font-bold text-primary">
                    {taskStatus.attemptCount}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {isUploaded ? "Uploaded" : "Attempts"}
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

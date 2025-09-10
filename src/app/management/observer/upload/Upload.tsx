"use client";
import type React from "react";
import { useState } from "react";
import { FiCheckCircle, FiAlertCircle, FiFile } from "react-icons/fi";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card";
import TASK_TYPE from "@constants/survey.type.constant";
import FileDropZone from "@components/ui/FileDropZone";
import { useToast } from "@management/hooks/use-toast";
import startUtilityAPI from "@services/start.utility";
import { Button } from "@components/ui/button";

interface FileWithTask {
  file: File;
  taskType: string | null;
}

export default function Upload({ user }: { user: any }) {
  const { toast } = useToast();
  const [files, setFiles] = useState<FileWithTask[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadedTasks, setUploadedTasks] = useState<Record<string, boolean>>(
    {}
  );

  // Detect task type from file name
  const detectTaskType = (fileName: string): string | null => {
    for (const taskType of TASK_TYPE) {
      if (fileName.includes(taskType)) {
        return taskType;
      }
    }
    return null;
  };

  // Handle files selected from FileDropZone
  const handleFilesSelected = (fileList: FileList) => {
    const newFiles = Array.from(fileList)
      .map((file) => {
        // Basic check for file extension as MIME types can be unreliable
        const isAllowedExtension = /\.(json|csv)$/i.test(file.name);

        if (!isAllowedExtension) {
          toast({
            variant: "destructive",
            title: "Invalid File Type",
            description: `${file.name}. Only JSON and CSV files are accepted.`,
          });
          return null;
        }
        return { file, taskType: detectTaskType(file.name) };
      })
      .filter((file): file is FileWithTask => file !== null);
    setFiles((prev) => [...prev, ...newFiles]);
  };

  // Upload a single file using the AWS route
  const uploadFile = async (fileWithTask: FileWithTask): Promise<boolean> => {
    if (!fileWithTask.taskType) {
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: `Could not determine task type for ${fileWithTask.file.name}`,
      });
      return false;
    }

    // Extract user metadata for the upload
    const { organisationId, childId } = user;

    if (!organisationId || !childId) {
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description:
          "Missing required user metadata (organisationId or childId)",
      });
      return false;
    }

    const formData = new FormData();
    formData.append("file", fileWithTask.file);
    formData.append("title", fileWithTask.file.name);
    formData.append("taskId", fileWithTask.taskType);
    formData.append("childId", childId);
    formData.append("organisationId", organisationId);

    try {
      // Use StartUtilityAPI which handles authentication and token refresh automatically

      const result = await startUtilityAPI.files.upload(formData);

      console.log(
        `File ${fileWithTask.file.name} uploaded successfully:`,
        result
      );
      return true;
    } catch (error) {
      console.error(`Failed to upload ${fileWithTask.file.name}:`, error);
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: `${fileWithTask.file.name}: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      });
      return false;
    }
  };

  // Upload a single task's files
  const uploadTask = async (taskType: string) => {
    const taskFiles = files.filter((f) => f.taskType === taskType);

    if (taskFiles.length === 0) {
      toast({
        variant: "destructive",
        title: "No Files",
        description: `No files found for ${taskType}`,
      });
      return;
    }

    setUploading(true);

    try {
      const results = await Promise.all(taskFiles.map(uploadFile));
      const success = results.every(Boolean);

      if (success) {
        setUploadedTasks((prev) => ({
          ...prev,
          [taskType]: true,
        }));

        // Remove successfully uploaded files for this task
        setFiles((prev) => prev.filter((f) => f.taskType !== taskType));

        toast({
          title: "Task Upload Complete",
          description: `All files for ${taskType} uploaded successfully`,
        });
      } else {
        // Remove only the successfully uploaded files
        const successfulUploads = taskFiles.filter(
          (_, index) => results[index]
        );
        setFiles((prev) => prev.filter((f) => !successfulUploads.includes(f)));

        const successCount = results.filter(Boolean).length;
        toast({
          variant: "destructive",
          title: "Partial Upload",
          description: `${successCount}/${taskFiles.length} files uploaded for ${taskType}`,
        });
      }
    } finally {
      setUploading(false);
    }
  };

  // Bulk upload all files
  const uploadAllFiles = async () => {
    if (files.length === 0) {
      toast({
        variant: "destructive",
        title: "No Files",
        description: "Please add files before uploading",
      });
      return;
    }

    setUploading(true);

    try {
      const results = await Promise.all(files.map(uploadFile));

      // Update uploaded tasks and track successful uploads
      const newUploadedTasks: Record<string, boolean> = {};
      const successfulUploads: FileWithTask[] = [];

      files.forEach((fileWithTask, index) => {
        if (fileWithTask.taskType && results[index]) {
          newUploadedTasks[fileWithTask.taskType] = true;
          successfulUploads.push(fileWithTask);
        }
      });

      setUploadedTasks((prev) => ({
        ...prev,
        ...newUploadedTasks,
      }));

      // Remove successfully uploaded files from the list
      setFiles((prev) => prev.filter((f) => !successfulUploads.includes(f)));

      // Show summary
      const successCount = successfulUploads.length;
      const totalCount = files.length;
      toast({
        title: "Upload Summary",
        description: `${successCount}/${totalCount} files uploaded successfully`,
      });
    } finally {
      setUploading(false);
    }
  };

  // Remove a file from the list
  const removeFile = (fileToRemove: FileWithTask) => {
    setFiles((prev) => prev.filter((f) => f !== fileToRemove));
  };

  // Get files for a specific task
  const getFilesForTask = (taskType: string) => {
    return files.filter((f) => f.taskType === taskType);
  };

  // Check if user has required metadata
  const hasRequiredMetadata = user?.organisationId && user?.childId;

  return (
    <div className="container mx-auto py-8 px-4 ">
      {/* File Upload Area */}
      <Card className="mb-8 border-primary">
        <CardHeader>
          <CardTitle>Upload Files</CardTitle>
          <CardDescription>
            Upload JSON or CSV files for your tasks. Files will be automatically
            associated with tasks based on their names.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!hasRequiredMetadata ? (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-yellow-800">
                ⚠️ Missing required metadata. Please ensure you have
                organisationId and childId configured.
              </p>
            </div>
          ) : (
            <FileDropZone onFilesSelected={handleFilesSelected} />
          )}
        </CardContent>
      </Card>

      {/* File List */}
      {files.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Selected Files</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {files.map((fileWithTask, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-md"
                >
                  <div>
                    <p className="font-medium">{fileWithTask.file.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {fileWithTask.taskType
                        ? `Task: ${fileWithTask.taskType}`
                        : "Unknown task type"}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(fileWithTask)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={uploadAllFiles}
              disabled={uploading || !hasRequiredMetadata}
              className="w-full"
            >
              {uploading ? "Uploading..." : "Bulk Upload All Files"}
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Tasks List */}
      <Card>
        <CardHeader>
          <CardTitle>Tasks</CardTitle>
          <CardDescription>
            Upload files for specific tasks or use bulk upload for all tasks.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {TASK_TYPE.map((taskType) => {
              const taskFiles = getFilesForTask(taskType);
              const hasFiles = taskFiles.length > 0;
              const isUploaded = uploadedTasks[taskType];

              return (
                <div
                  key={taskType}
                  className="flex items-center justify-between p-4 border rounded-md"
                >
                  <div className="flex items-center gap-3">
                    {isUploaded ? (
                      <FiCheckCircle className="h-5 w-5 text-green-500" />
                    ) : hasFiles ? (
                      <FiFile className="h-5 w-5 text-primary" />
                    ) : (
                      <FiAlertCircle className="h-5 w-5 text-muted-foreground" />
                    )}
                    <div>
                      <p className="font-medium">{taskType}</p>
                      <p className="text-sm text-muted-foreground">
                        {isUploaded
                          ? "Uploaded"
                          : hasFiles
                          ? `${taskFiles.length} file(s) ready`
                          : "No files"}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant={hasFiles ? "default" : "outline"}
                    size="sm"
                    disabled={
                      !hasFiles ||
                      uploading ||
                      isUploaded ||
                      !hasRequiredMetadata
                    }
                    onClick={() => uploadTask(taskType)}
                  >
                    {isUploaded
                      ? "Uploaded"
                      : uploading
                      ? "Uploading..."
                      : "Upload"}
                  </Button>
                </div>
              );
            })}
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={uploadAllFiles}
            disabled={uploading || files.length === 0 || !hasRequiredMetadata}
            className="w-full"
          >
            {uploading ? "Uploading..." : "Bulk Upload All Files"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

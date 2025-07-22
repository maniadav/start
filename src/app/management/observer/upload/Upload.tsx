"use client";

import type React from "react";

import { useState, useCallback } from "react";
import { FiUpload, FiCheckCircle, FiAlertCircle, FiFile } from "react-icons/fi";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card";
import TASK_TYPE from "@constants/survey.type.constant";
import FileDropZone from "components/common/FileDropZone";
import Button from "components/common/Button";

interface FileWithTask {
  file: File;
  taskType: string | null;
}

export default function Upload() {
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
    const newFiles = Array.from(fileList).map((file) => ({
      file,
      taskType: detectTaskType(file.name),
    }));
    setFiles((prev) => [...prev, ...newFiles]);
  };

  // Upload a single file
  const uploadFile = async (fileWithTask: FileWithTask): Promise<boolean> => {
    if (!fileWithTask.taskType) {
      alert(
        `Upload Failed: Could not determine task type for ${fileWithTask.file.name}`
      );
      return false;
    }

    // Create form data
    const formData = new FormData();
    formData.append("file", fileWithTask.file);
    formData.append("taskType", fileWithTask.taskType);

    try {
      // In a real app, you would replace this with your actual API endpoint
      // const response = await fetch('/api/upload', {
      //   method: 'POST',
      //   body: formData
      // })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // if (!response.ok) throw new Error('Upload failed')

      alert(
        `Upload Successful: ${fileWithTask.file.name} uploaded for ${fileWithTask.taskType}`
      );

      return true;
    } catch (error) {
      alert(
        `Upload Failed: Error uploading ${fileWithTask.file.name}: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
      return false;
    }
  };

  // Upload a single task's files
  const uploadTask = async (taskType: string) => {
    const taskFiles = files.filter((f) => f.taskType === taskType);

    if (taskFiles.length === 0) {
      alert(`No Files: No files found for ${taskType}`);
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
      }
    } finally {
      setUploading(false);
    }
  };

  // Bulk upload all files
  const uploadAllFiles = async () => {
    if (files.length === 0) {
      alert("No Files: Please add files before uploading");
      return;
    }

    setUploading(true);

    try {
      const results = await Promise.all(files.map(uploadFile));

      // Update uploaded tasks
      const newUploadedTasks: Record<string, boolean> = {};

      files.forEach((fileWithTask, index) => {
        if (fileWithTask.taskType && results[index]) {
          newUploadedTasks[fileWithTask.taskType] = true;
        }
      });

      setUploadedTasks((prev) => ({
        ...prev,
        ...newUploadedTasks,
      }));

      // Remove uploaded files
      const successfulUploads = files.filter((_, index) => results[index]);
      setFiles((prev) => prev.filter((f) => !successfulUploads.includes(f)));
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
          <FileDropZone onFilesSelected={handleFilesSelected} />
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
              disabled={uploading}
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
                    disabled={!hasFiles || uploading || isUploaded}
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
            disabled={uploading || files.length === 0}
            className="w-full"
          >
            {uploading ? "Uploading..." : "Bulk Upload All Files"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

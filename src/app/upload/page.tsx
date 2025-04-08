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

interface ButtonProps {
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
}

const Button = ({
  variant = "default",
  size = "md",
  disabled = false,
  onClick,
  className = "",
  children,
}: ButtonProps) => {
  const baseStyles =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

  const variantStyles = {
    default: "bg-black text-white hover:bg-primary/90",
    outline:
      "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    ghost: "hover:bg-accent hover:text-accent-foreground",
  };

  const sizeStyles = {
    sm: "h-9 px-3 text-sm",
    md: "h-10 px-4 py-2",
    lg: "h-11 px-8 text-lg",
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

// Define the task types
const TASK_TYPES = [
  "BubblePoppingTask",
  "DelayedGratificationTask",
  "MotorFollowingTask",
  "ButtonTask",
  "SynchronyTask",
  "LanguageSamplingTask",
  "WheelTask",
  "PreferentialLookingTask",
];

// Define the file type
interface FileWithTask {
  file: File;
  taskType: string | null;
}

export default function FileUploadPage() {
  const [files, setFiles] = useState<FileWithTask[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadedTasks, setUploadedTasks] = useState<Record<string, boolean>>(
    {}
  );

  // Detect task type from file name
  const detectTaskType = (fileName: string): string | null => {
    for (const taskType of TASK_TYPES) {
      if (fileName.includes(taskType)) {
        return taskType;
      }
    }
    return null;
  };

  // Handle file drop
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    if (e.dataTransfer.files) {
      const newFiles = Array.from(e.dataTransfer.files).map((file) => ({
        file,
        taskType: detectTaskType(file.name),
      }));

      setFiles((prev) => [...prev, ...newFiles]);
    }
  }, []);

  // Handle file selection via input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map((file) => ({
        file,
        taskType: detectTaskType(file.name),
      }));

      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  // Handle drag over
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
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
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Task File Upload</h1>

      {/* File Upload Area */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Upload Files</CardTitle>
          <CardDescription>
            Upload JSON or CSV files for your tasks. Files will be automatically
            associated with tasks based on their names.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-muted/50 transition-colors"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => document.getElementById("fileInput")?.click()}
          >
            <FiUpload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg mb-2">Drag and drop files here</p>
            <p className="text-sm text-muted-foreground mb-4">
              or click to browse
            </p>
            <Button variant="outline" size="sm">
              Select Files
            </Button>
            <input
              id="fileInput"
              type="file"
              multiple
              accept=".json,.csv"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
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
            {TASK_TYPES.map((taskType) => {
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
                      <FiFile className="h-5 w-5 text-blue-500" />
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

import React from "react";
import { FiUpload } from "react-icons/fi";
import { Button } from "../button/button";

interface FileDropZoneProps {
  onFilesSelected: (files: FileList) => void;
}

const FileDropZone: React.FC<FileDropZoneProps> = ({ onFilesSelected }) => {
  // Handle file drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      onFilesSelected(e.dataTransfer.files);
    }
  };

  // Handle file selection via input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      onFilesSelected(e.target.files);
    }
  };

  // Handle drag over
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div
      className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-muted/50 transition-colors"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onClick={() => document.getElementById("fileInput")?.click()}
    >
      <FiUpload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
      <p className="text-lg mb-2">Drag and drop files here</p>
      <p className="text-sm text-muted-foreground mb-4">or click to browse</p>
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
  );
};

export default FileDropZone;

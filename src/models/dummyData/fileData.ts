import { IFile } from "../file.model";
import mongoose from "mongoose";

// Dummy File data for seeding
export const dummyFiles: Partial<IFile>[] = [
  {
    title: "Sample File 1",
    task_id: "BubblePoppingTask", 
    file_size: 1024,
    organisation_id: mongoose.Types.ObjectId.createFromHexString("000000000000000000000001"),
    observer_id: mongoose.Types.ObjectId.createFromHexString("000000000000000000000002"),
    child_id: mongoose.Types.ObjectId.createFromHexString("000000000000000000000003"),
    date_created: new Date(),
    file_url: "https://example.com/file1.pdf",
  },
  {
    title: "Sample File 2",
    task_id: "LanguageSamplingTask",
    file_size: 2048,
    organisation_id: mongoose.Types.ObjectId.createFromHexString("000000000000000000000001"),
    observer_id: mongoose.Types.ObjectId.createFromHexString("000000000000000000000002"),
    child_id: mongoose.Types.ObjectId.createFromHexString("000000000000000000000003"),
    date_created: new Date(),
    file_url: "https://example.com/file2.pdf",
  },
];

export function validateDummyFilesConsistency(): boolean {
  // Add any validation logic if needed
  return Array.isArray(dummyFiles) && dummyFiles.length > 0;
}

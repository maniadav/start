import type {
  Organisation,
  Survey,
  UploadedFile,
  Observer,
} from "../../types/management.types";
import {
  observerProfiles,
  surveys as dbSurveys,
  files as dbFiles,
} from "@data/start.data";

// Transform ObserverProfile to Observer
function transformObserver(profile: (typeof observerProfiles)[0]): Observer {
  return {
    id: profile.id,
    name: profile.name,
    email: profile.email,
    address: profile.address,
    status: profile.status,
    organizationId: profile.organizationId,
    createdAt: profile.createdAt,
  };
}

// Simulating API calls with Promise-based functions
export async function fetchOrganisations(): Promise<Organisation[]> {
  try {
    const response = await fetch("/api/v1/admin/organisation/list");
    if (!response.ok) {
      throw new Error("Failed to fetch organizations");
    }
    const data = await response.json();
    return data; // Return API response directly - matches Organisation interface
  } catch (error) {
    console.error("Error fetching organizations:", error);
    return [];
  }
}

// Sync version for existing code compatibility
export function getOrganizations(): Organisation[] {
  // For sync version, we'll need to maintain some state or use a different approach
  // This is a temporary fallback - ideally all components should use the async version
  console.warn(
    "getOrganizations() is synchronous but data fetching is async. Consider using fetchOrganizations() instead."
  );
  return [];
}

export async function fetchObservers(): Promise<Observer[]> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return observerProfiles.map(transformObserver);
}

export function getObservers(): Observer[] {
  return observerProfiles.map(transformObserver);
}

export async function fetchSurveys(): Promise<Survey[]> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return dbSurveys;
}

export function getSurveys(): Survey[] {
  return dbSurveys;
}

export async function fetchFiles(): Promise<UploadedFile[]> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return dbFiles;
}

export function getFiles(): UploadedFile[] {
  return dbFiles;
}

// Save operations would typically be POST/PUT requests to an API
export async function saveOrganizations(
  organizations: Organisation[]
): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  // In a real API, this would be a POST/PUT request
  console.log("Saving organizations:", organizations);
}

export async function saveObservers(observers: Observer[]): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  console.log("Saving observers:", observers);
}

export async function saveSurveys(surveys: Survey[]): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  console.log("Saving surveys:", surveys);
}

export async function saveFiles(files: UploadedFile[]): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  console.log("Saving files:", files);
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return (
    Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  );
}

export function getOccupiedStorage(organizationId: string): number {
  const files = getFiles().filter((f) => f.organizationId === organizationId);
  return files.reduce((total, file) => total + file.size, 0);
}

export function getStoragePercentage(organizationId: string): number {
  const org = getOrganizations().find((o) => o.unique_id === organizationId);
  if (!org || !org.allowedStorage) return 0;

  const occupied = getOccupiedStorage(organizationId);
  const allowed = org.allowedStorage * 1024 * 1024; // Convert MB to bytes

  return Math.round((occupied / allowed) * 100);
}

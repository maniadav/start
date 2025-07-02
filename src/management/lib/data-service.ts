import type { Organisation, Survey, UploadedFile, Observer } from "../../types/management.types"
import { STORAGE_KEYS } from "./auth"

export function getOrganizations(): Organisation[] {
  if (typeof window === "undefined") return []
  const orgs = localStorage.getItem(STORAGE_KEYS.ORGANISATIONS)
  return orgs ? JSON.parse(orgs) : []
}

export function saveOrganizations(organizations: Organisation[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEYS.ORGANISATIONS, JSON.stringify(organizations))
}

export function getObservers(): Observer[] {
  if (typeof window === "undefined") return []
  const observers = localStorage.getItem(STORAGE_KEYS.OBSERVERS)
  return observers ? JSON.parse(observers) : []
}

export function saveObservers(observers: Observer[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEYS.OBSERVERS, JSON.stringify(observers))
}

export function getSurveys(): Survey[] {
  if (typeof window === "undefined") return []
  const surveys = localStorage.getItem(STORAGE_KEYS.SURVEYS)
  return surveys ? JSON.parse(surveys) : []
}

export function saveSurveys(surveys: Survey[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEYS.SURVEYS, JSON.stringify(surveys))
}

export function getFiles(): UploadedFile[] {
  if (typeof window === "undefined") return []
  const files = localStorage.getItem(STORAGE_KEYS.FILES)
  return files ? JSON.parse(files) : []
}

export function saveFiles(files: UploadedFile[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEYS.FILES, JSON.stringify(files))
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

export function getOccupiedStorage(organizationId: string): number {
  const files = getFiles().filter((f) => f.organizationId === organizationId)
  return files.reduce((total, file) => total + file.size, 0)
}

export function getStoragePercentage(organizationId: string): number {
  const org = getOrganizations().find((o) => o.id === organizationId)
  if (!org) return 0

  const occupied = getOccupiedStorage(organizationId)
  const allowed = org.allowedStorage * 1024 * 1024 // Convert MB to bytes

  return Math.round((occupied / allowed) * 100)
}

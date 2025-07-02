"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Upload, X, FileText } from "lucide-react"
import { getCurrentUser } from "@management/lib/auth"
import { getSurveys, getFiles, saveFiles } from "@management/lib/data-service"
import { Button } from "@management/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@management/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@management/components/ui/select"
import { Label } from "@management/components/ui/label"
import { SidebarTrigger } from "@management/components/ui/sidebar"
import { useToast } from "@management/hooks/use-toast"
import { Progress } from "@management/components/ui/progress"
import type { UploadedFile } from "@type/management.types"

export default function UploadPage() {
  const user = getCurrentUser()
  const surveys = getSurveys().filter((s) => s.organizationId === user?.organizationId)
  const [selectedSurvey, setSelectedSurvey] = useState("")
  const [dragActive, setDragActive] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const { toast } = useToast()

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setDragActive(false)

      const droppedFiles = Array.from(e.dataTransfer.files)
      const csvFiles = droppedFiles.filter((file) => file.name.endsWith(".csv"))

      if (csvFiles.length !== droppedFiles.length) {
        toast({
          title: "Invalid files",
          description: "Only CSV files are allowed",
          variant: "destructive",
        })
      }

      setFiles((prev) => [...prev, ...csvFiles])
    },
    [toast],
  )

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      const csvFiles = selectedFiles.filter((file) => file.name.endsWith(".csv"))

      if (csvFiles.length !== selectedFiles.length) {
        toast({
          title: "Invalid files",
          description: "Only CSV files are allowed",
          variant: "destructive",
        })
      }

      setFiles((prev) => [...prev, ...csvFiles])
    }
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleUpload = async () => {
    if (!selectedSurvey || files.length === 0 || !user) {
      toast({
        title: "Error",
        description: "Please select a survey and add files to upload",
        variant: "destructive",
      })
      return
    }

    setUploading(true)
    setUploadProgress(0)

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval)
          return prev
        }
        return prev + 10
      })
    }, 200)

    // Simulate upload delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const existingFiles = getFiles()
    const newFiles: UploadedFile[] = files.map((file, index) => ({
      id: (existingFiles.length + index + 1).toString(),
      name: file.name,
      size: file.size,
      surveyId: selectedSurvey,
      organizationId: user.organizationId!,
      uploadedBy: user.id,
      uploadedAt: new Date().toISOString(),
      url: `/dummy-files/${file.name}`,
    }))

    const updatedFiles = [...existingFiles, ...newFiles]
    saveFiles(updatedFiles)

    setUploadProgress(100)

    setTimeout(() => {
      setUploading(false)
      setUploadProgress(0)
      setFiles([])
      setSelectedSurvey("")

      toast({
        title: "Upload successful",
        description: `${files.length} file(s) uploaded successfully`,
      })
    }, 500)
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center space-x-2">
        <SidebarTrigger />
        <h2 className="text-3xl font-bold tracking-tight">Upload Files</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Upload CSV Files</CardTitle>
            <CardDescription>
              Upload CSV files for your surveys. Drag and drop or click to select files.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="survey-select">Select Survey</Label>
              <Select value={selectedSurvey} onValueChange={setSelectedSurvey}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a survey" />
                </SelectTrigger>
                <SelectContent>
                  {surveys.map((survey) => (
                    <SelectItem key={survey.id} value={survey.id}>
                      {survey.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive
                  ? "border-primary bg-primary/5"
                  : "border-muted-foreground/25 hover:border-muted-foreground/50"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <div className="space-y-2">
                <p className="text-lg font-medium">Drop CSV files here</p>
                <p className="text-sm text-muted-foreground">or click to browse files</p>
                <input
                  type="file"
                  multiple
                  accept=".csv"
                  onChange={handleFileInput}
                  className="hidden"
                  id="file-upload"
                />
                <Button variant="outline" onClick={() => document.getElementById("file-upload")?.click()}>
                  Browse Files
                </Button>
              </div>
            </div>

            {uploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} />
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Selected Files</CardTitle>
            <CardDescription>Files ready for upload ({files.length} selected)</CardDescription>
          </CardHeader>
          <CardContent>
            {files.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No files selected</p>
            ) : (
              <div className="space-y-2">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{file.name}</p>
                        <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => removeFile(index)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                <Button
                  onClick={handleUpload}
                  disabled={!selectedSurvey || files.length === 0 || uploading}
                  className="w-full mt-4"
                >
                  {uploading ? "Uploading..." : `Upload ${files.length} File(s)`}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

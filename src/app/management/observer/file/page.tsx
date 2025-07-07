"use client";

import { Download, FileText } from "lucide-react";
import { getCurrentUser } from "@management/lib/auth";
import {
  getFiles,
  getSurveys,
  formatFileSize,
} from "@management/lib/data-service";
import { Button } from "@management/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@management/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@management/components/ui/table";

import { Badge } from "@management/components/ui/badge";
import SidebarTrigger from "@management/SidebarTrigger";

export default function OrgFilesPage() {
  const user = getCurrentUser();
  const files = getFiles().filter(
    (f) => f.organizationId === user?.organizationId
  );
  const surveys = getSurveys();

  const handleDownload = (file: any) => {
    // Simulate file download
    const link = document.createElement("a");
    link.href = `data:text/csv;charset=utf-8,Sample CSV content for ${file.name}`;
    link.download = file.name;
    link.click();
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center space-x-2">
        <SidebarTrigger />
        <h2 className="text-3xl font-bold tracking-tight">File Manager</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Organisation Files
          </CardTitle>
        </CardHeader>
        <CardContent className="w-auto overflow-x-scroll">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>File Name</TableHead>
                <TableHead>Survey</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Upload Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {files.map((file) => {
                const survey = surveys.find((s) => s.id === file.surveyId);

                return (
                  <TableRow key={file.id}>
                    <TableCell className="font-medium">{file.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{survey?.name}</Badge>
                    </TableCell>
                    <TableCell>{formatFileSize(file.size)}</TableCell>
                    <TableCell>
                      {new Date(file.uploadedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload(file)}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import { FileText, Upload } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "components/ui/card";
import { SidebarTriggerComp } from "@components/ui/SidebarTrigger";

export default function OrgDashboard() {
  // Dummy data for the dashboard
  const dummySurveys = [
    {
      id: "1",
      name: "Child Development Survey 2024",
      description: "Annual assessment of cognitive development",
      createdAt: "2024-01-15",
      organizationId: "org-123",
    },
    {
      id: "2",
      name: "Language Skills Assessment",
      description: "Evaluation of communication abilities",
      createdAt: "2024-01-10",
      organizationId: "org-123",
    },
    {
      id: "3",
      name: "Motor Skills Evaluation",
      description: "Physical coordination assessment",
      createdAt: "2024-01-05",
      organizationId: "org-123",
    },
  ];

  const dummyFiles = [
    {
      id: "1",
      name: "survey_results_jan_2024.csv",
      size: 2048576, // 2MB
      organizationId: "org-123",
      surveyId: "1",
      uploadedAt: "2024-01-16",
    },
    {
      id: "2",
      name: "language_assessment_data.csv",
      size: 1536000, // 1.5MB
      organizationId: "org-123",
      surveyId: "2",
      uploadedAt: "2024-01-12",
    },
    {
      id: "3",
      name: "motor_skills_results.csv",
      size: 1048576, // 1MB
      organizationId: "org-123",
      surveyId: "3",
      uploadedAt: "2024-01-08",
    },
  ];

  const stats = [
    {
      title: "Active Surveys",
      value: dummySurveys.length,
      description: "Surveys in your organization",
      icon: FileText,
    },
    {
      title: "Uploaded Files",
      value: dummyFiles.length,
      description: "CSV files uploaded",
      icon: Upload,
    },
    {
      title: "Total Size",
      value: `${Math.round(
        dummyFiles.reduce((acc, f) => acc + f.size, 0) / 1024 / 1024
      )}MB`,
      description: "Storage used",
      icon: FileText,
    },
  ];

  return (
    <div className="w-full flex flex-col gap-4 p-4 md:p-8">
      <SidebarTriggerComp title="Observer Dashboard" />

      <div className="pb-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Surveys</CardTitle>
            <CardDescription>
              Latest surveys in your organization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dummySurveys.map((survey) => (
                <div key={survey.id} className="flex items-center space-x-4">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {survey.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {survey.description}
                    </p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(survey.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Uploads</CardTitle>
            <CardDescription>Latest file uploads</CardDescription>
          </CardHeader>
          <CardContent className="w-auto overflow-x-scroll">
            <div className="space-y-4">
              {dummyFiles.map((file) => {
                const survey = dummySurveys.find((s) => s.id === file.surveyId);
                return (
                  <div key={file.id} className="flex items-center space-x-4">
                    <Upload className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {file.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {survey?.name}
                      </p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(file.uploadedAt).toLocaleDateString()}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

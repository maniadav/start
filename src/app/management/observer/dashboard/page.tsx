"use client";

import { FileText, Upload } from "lucide-react";
import { getCurrentUser } from "@management/lib/auth";
import {
  getOrganizations,
  getSurveys,
  getFiles,
} from "@management/lib/data-service";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@management/components/ui/card";
import SidebarTrigger from "@management/SidebarTrigger";

export default function OrgDashboard() {
  const user = getCurrentUser();
  const organizations = getOrganizations();
  const surveys = getSurveys();
  const files = getFiles();

  const userOrg = organizations.find((o) => o.id === user?.organizationId);
  const orgSurveys = surveys.filter(
    (s) => s.organizationId === user?.organizationId
  );
  const orgFiles = files.filter(
    (f) => f.organizationId === user?.organizationId
  );

  const stats = [
    {
      title: "Active Surveys",
      value: orgSurveys.length,
      description: "Surveys in your organization",
      icon: FileText,
    },
    {
      title: "Uploaded Files",
      value: orgFiles.length,
      description: "CSV files uploaded",
      icon: Upload,
    },
    {
      title: "Total Size",
      value: `${Math.round(
        orgFiles.reduce((acc, f) => acc + f.size, 0) / 1024 / 1024
      )}MB`,
      description: "Storage used",
      icon: FileText,
    },
  ];

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center space-x-2">
        <SidebarTrigger />
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Organisation Dashboard
          </h2>
          <p className="text-muted-foreground">{userOrg?.name}</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
              {orgSurveys.slice(0, 5).map((survey) => (
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
              {orgFiles.slice(0, 5).map((file) => {
                const survey = surveys.find((s) => s.id === file.surveyId);
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

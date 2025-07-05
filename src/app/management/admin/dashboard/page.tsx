"use client";

import React, { useEffect, useState } from "react";
import {
  Building2,
  FileText,
  Users,
  Eye,
  HardDrive,
  TrendingUp,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@management/components/ui/card";
import { SidebarTrigger } from "@management/components/ui/sidebar";
import { Progress } from "@management/components/ui/progress";
import { Badge } from "@management/components/ui/badge";
import type {
  OrganisationProfile,
  Survey,
  UploadedFile,
  ObserverProfile,
  User,
} from "types/management.types";

export default function AdminDashboard() {
  const [organizations, setOrganizations] = useState<OrganisationProfile[]>([]);
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [observers, setObservers] = useState<ObserverProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const [orgRes, surRes, fileRes, userRes, obsRes] = await Promise.all([
        fetch("/api/v1/admin/organizations").then((r) => r.json()),
        fetch("/api/v1/admin/surveys").then((r) => r.json()),
        fetch("/api/v1/admin/files").then((r) => r.json()),
        fetch("/api/v1/admin/users").then((r) => r.json()),
        fetch("/api/v1/admin/observers").then((r) => r.json()),
      ]);
      setOrganizations(orgRes);
      setSurveys(surRes);
      setFiles(fileRes);
      setUsers(userRes);
      setObservers(obsRes);
      setLoading(false);
    }
    fetchData();
  }, []);

  // Helper to get occupied storage for an org
  function getOccupiedStorage(organizationId: string) {
    return files
      .filter((f) => f.organizationId === organizationId)
      .reduce((total, file) => total + file.size, 0);
  }

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  // Calculate statistics
  const totalStorage = organizations.reduce(
    (acc, org) => acc + org.allowedStorage,
    0
  );
  const occupiedStorage =
    organizations.reduce((acc, org) => acc + getOccupiedStorage(org.id), 0) /
    (1024 * 1024); // Convert to MB
  const storagePercentage = Math.round((occupiedStorage / totalStorage) * 100);

  const statusCounts = {
    active: organizations.filter((org) => org.status === "active").length,
    pending: organizations.filter((org) => org.status === "pending").length,
    deactivated: organizations.filter((org) => org.status === "deactivated")
      .length,
  };

  const stats = [
    {
      title: "Total Organizations",
      value: organizations.length,
      description: `${statusCounts.active} active, ${statusCounts.pending} pending`,
      icon: Building2,
      trend: "+12% from last month",
    },
    {
      title: "Total Observers",
      value: observers.length,
      description: "Across all organizations",
      icon: Eye,
      trend: "+8% from last month",
    },
    {
      title: "Total Users",
      value: users.length,
      description: "All registered users",
      icon: Users,
      trend: "+15% from last month",
    },
    {
      title: "Storage Usage",
      value: `${Math.round(occupiedStorage)}MB`,
      description: `${storagePercentage}% of ${totalStorage}MB total`,
      icon: HardDrive,
      trend: `${storagePercentage}% utilized`,
    },
    {
      title: "Total Surveys",
      value: surveys.length,
      description: "Active survey projects",
      icon: FileText,
      trend: "+5% from last month",
    },
    {
      title: "Uploaded Files",
      value: files.length,
      description: "CSV files in system",
      icon: FileText,
      trend: "+22% from last month",
    },
  ];

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div className="flex items-center space-x-2">
          {/* <SidebarTrigger /> */}
          <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
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
              <div className="flex items-center pt-1">
                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                <span className="text-xs text-green-500">{stat.trend}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Storage Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Storage Overview</CardTitle>
          <CardDescription>
            Storage usage across all organizations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Total Usage</span>
              <span className="text-sm text-muted-foreground">
                {Math.round(occupiedStorage)}MB / {totalStorage}MB
              </span>
            </div>
            <Progress value={storagePercentage} className="h-2" />
            <div className="grid gap-4 md:grid-cols-3">
              {organizations.map((org) => {
                const orgOccupied = getOccupiedStorage(org.id) / (1024 * 1024); // Convert to MB
                const orgPercentage = Math.round(
                  (orgOccupied / org.allowedStorage) * 100
                );
                return (
                  <div key={org.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{org.name}</span>
                      <Badge
                        variant={
                          org.status === "active" ? "default" : "secondary"
                        }
                      >
                        {org.status}
                      </Badge>
                    </div>
                    <Progress value={orgPercentage} className="h-1" />
                    <div className="text-xs text-muted-foreground">
                      {Math.round(orgOccupied)}MB / {org.allowedStorage}MB (
                      {orgPercentage}%)
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest file uploads and system activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {files.slice(0, 5).map((file) => {
                const org = organizations.find(
                  (o) => o.id === file.organizationId
                );
                const survey = surveys.find((s) => s.id === file.surveyId);
                const observer = observers.find(
                  (o) => o.id === file.observerId
                );
                const uploader = users.find((u) => u.id === file.uploadedBy);
                return (
                  <div key={file.id} className="flex items-center space-x-4">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {file.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {org?.name} • {observer?.name} • {survey?.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Uploaded by {uploader?.id}
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

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>Current system health and status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  Active Organizations
                </span>
                <Badge variant="default">{statusCounts.active}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  Pending Organizations
                </span>
                <Badge variant="secondary">{statusCounts.pending}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Active Observers</span>
                <Badge variant="default">
                  {observers.filter((o) => o.status === "active").length}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">System Health</span>
                <Badge variant="default">Healthy</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

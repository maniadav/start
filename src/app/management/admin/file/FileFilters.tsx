import * as React from "react";
import { AdvancedFilters } from "@management/components/advanced-filters";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@management/components/ui/select";
import { Label } from "@management/components/ui/label";

interface FileFiltersProps {
  filters: any;
  setFilters: (filters: any) => void;
  surveyFilter: string;
  setSurveyFilter: (v: string) => void;
  orgFilter: string;
  setOrgFilter: (v: string) => void;
  observerFilter: string;
  setObserverFilter: (v: string) => void;
  surveys: { id: string; name: string }[];
  organizations: { id: string; name: string }[];
  observers: { id: string; name: string }[];
}

export function FileFilters({
  filters,
  setFilters,
  surveyFilter,
  setSurveyFilter,
  orgFilter,
  setOrgFilter,
  observerFilter,
  setObserverFilter,
  surveys,
  organizations,
  observers,
}: FileFiltersProps) {
  return (
    <div className="flex items-center gap-4 flex-wrap">
      <AdvancedFilters filters={filters} onFiltersChange={setFilters} showDateFilter />
      <div className="flex items-center gap-2">
        <Label htmlFor="survey-filter" className="text-sm">Survey:</Label>
        <Select value={surveyFilter} onValueChange={setSurveyFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All surveys" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All surveys</SelectItem>
            {surveys.map((survey) => (
              <SelectItem key={survey.id} value={survey.id}>{survey.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-2">
        <Label htmlFor="org-filter" className="text-sm">Organisation:</Label>
        <Select value={orgFilter} onValueChange={setOrgFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All orgs" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All organizations</SelectItem>
            {organizations.map((org) => (
              <SelectItem key={org.id} value={org.id}>{org.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-2">
        <Label htmlFor="observer-filter" className="text-sm">Observer:</Label>
        <Select value={observerFilter} onValueChange={setObserverFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All observers" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All observers</SelectItem>
            {observers.map((observer) => (
              <SelectItem key={observer.id} value={observer.id}>{observer.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

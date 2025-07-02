"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { getCurrentUser } from "@management/lib/auth"
import { getSurveys, saveSurveys } from "@management/lib/data-service"
import { Button } from "@management/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@management/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@management/components/ui/dialog"
import { Input } from "@management/components/ui/input"
import { Label } from "@management/components/ui/label"
import { Textarea } from "@management/components/ui/textarea"
import { SidebarTrigger } from "@management/components/ui/sidebar"
import { useToast } from "@management/hooks/use-toast"
import type { Survey } from "@type/management.types"

export default function SurveysPage() {
  const user = getCurrentUser()
  const [surveys, setSurveys] = useState(getSurveys().filter((s) => s.organizationId === user?.organizationId))
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [surveyName, setSurveyName] = useState("")
  const [surveyDescription, setSurveyDescription] = useState("")
  const { toast } = useToast()

  const handleCreateSurvey = () => {
    if (!surveyName || !user) {
      toast({
        title: "Error",
        description: "Please enter a survey name",
        variant: "destructive",
      })
      return
    }

    const allSurveys = getSurveys()
    const newSurveyId = (allSurveys.length + 1).toString()

    const newSurvey: Survey = {
      id: newSurveyId,
      name: surveyName,
      description: surveyDescription,
      organizationId: user.organizationId!,
      createdBy: user.id,
      createdAt: new Date().toISOString(),
    }

    const updatedSurveys = [...allSurveys, newSurvey]
    saveSurveys(updatedSurveys)
    setSurveys(updatedSurveys.filter((s) => s.organizationId === user.organizationId))

    toast({
      title: "Survey created",
      description: `${surveyName} has been created successfully`,
    })

    setIsDialogOpen(false)
    setSurveyName("")
    setSurveyDescription("")
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <SidebarTrigger />
          <h2 className="text-3xl font-bold tracking-tight">Surveys</h2>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Survey
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Survey</DialogTitle>
              <DialogDescription>Add a new survey to collect data for your organization.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="survey-name">Survey Name</Label>
                <Input
                  id="survey-name"
                  value={surveyName}
                  onChange={(e) => setSurveyName(e.target.value)}
                  placeholder="Enter survey name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="survey-description">Description (Optional)</Label>
                <Textarea
                  id="survey-description"
                  value={surveyDescription}
                  onChange={(e) => setSurveyDescription(e.target.value)}
                  placeholder="Enter survey description"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreateSurvey}>Create Survey</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {surveys.map((survey) => (
          <Card key={survey.id}>
            <CardHeader>
              <CardTitle>{survey.name}</CardTitle>
              <CardDescription>Created {new Date(survey.createdAt).toLocaleDateString()}</CardDescription>
            </CardHeader>
            <CardContent>
              {survey.description && <p className="text-sm text-muted-foreground">{survey.description}</p>}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

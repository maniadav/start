import { NextResponse } from "next/server";
import connectDB from "@lib/mongodb";
import { SurveyData } from "@models/SurveyData";
import { Child } from "@models/child.model";

// GET - Retrieve survey data for a child
export async function GET(req: Request) {
  try {
    await connectDB();
    
    const url = new URL(req.url);
    const childId = url.searchParams.get('childId');
    const assessmentId = url.searchParams.get('assessmentId');
    
    if (!childId) {
      return NextResponse.json(
        { error: "Child ID is required" },
        { status: 400 }
      );
    }

    // Build query
    const query: any = { child_id: childId };
    if (assessmentId) {
      query.assessment_id = assessmentId;
    }

    const surveys = await SurveyData.find(query)
      .populate('child_id', 'name gender')
      .sort({ created_at: -1 });

    return NextResponse.json({ data: surveys }, { status: 200 });
    
  } catch (error) {
    console.error("Survey fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch survey data" },
      { status: 500 }
    );
  }
}

// POST - Create or update survey data
export async function POST(req: Request) {
  try {
    await connectDB();
    
    const body = await req.json();
    const {
      childId,
      assessmentId,
      userId,
      userDob,
      userGender,
      observerId,
      attemptNumber,
      attemptData
    } = body;

    // Validation
    if (!childId || !assessmentId || !userId || !observerId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!attemptNumber || attemptNumber < 1 || attemptNumber > 3) {
      return NextResponse.json(
        { error: "Attempt number must be between 1 and 3" },
        { status: 400 }
      );
    }

    // Check if child exists
    const child = await Child.findById(childId);
    if (!child) {
      return NextResponse.json(
        { error: "Child not found" },
        { status: 404 }
      );
    }

    // Find existing survey or create new one
    let survey = await SurveyData.findOne({
      child_id: childId,
      assessment_id: assessmentId
    });

    if (!survey) {
      // Create new survey document
      survey = new SurveyData({
        child_id: childId,
        assessment_id: assessmentId,
        user_id: userId,
        user_dob: userDob ? new Date(userDob) : undefined,
        user_gender: userGender,
        observer_id: observerId,
        no_of_attempt: 0
      });
    }

    // Add the attempt data
    await survey.addAttempt(attemptNumber, attemptData);

    return NextResponse.json(
      { 
        message: "Survey data saved successfully",
        data: survey 
      },
      { status: 200 }
    );
    
  } catch (error) {
    console.error("Survey save error:", error);
    return NextResponse.json(
      { error: "Failed to save survey data" },
      { status: 500 }
    );
  }
}

// PUT - Update specific attempt data
export async function PUT(req: Request) {
  try {
    await connectDB();
    
    const body = await req.json();
    const { surveyId, attemptNumber, attemptData } = body;

    if (!surveyId || !attemptNumber || !attemptData) {
      return NextResponse.json(
        { error: "Survey ID, attempt number, and attempt data are required" },
        { status: 400 }
      );
    }

    const survey = await SurveyData.findById(surveyId);
    if (!survey) {
      return NextResponse.json(
        { error: "Survey not found" },
        { status: 404 }
      );
    }

    // Update the specific attempt
    await survey.addAttempt(attemptNumber, attemptData);

    return NextResponse.json(
      { 
        message: "Survey attempt updated successfully",
        data: survey 
      },
      { status: 200 }
    );
    
  } catch (error) {
    console.error("Survey update error:", error);
    return NextResponse.json(
      { error: "Failed to update survey data" },
      { status: 500 }
    );
  }
}

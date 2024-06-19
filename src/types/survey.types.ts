// types.ts

export interface Attempt {
    closedWithTimeout: boolean;
    timeTaken: string;
    ballCoord: string[];
    mouseCoord: string[];
    colors: string[];
    bubblesPopped: string;
    bubblesTotal: string;
    startTime: string;
    endTime: string;
    screenHeight: string;
    screenWidth: string;
    deviceType: string;
}

export interface BubblePoppingType {
    assestment_id: string;
    noOfAttempt: number;
    attempt1: Attempt;
    attempt2: Partial<Attempt>;
    attempt3: Partial<Attempt>;
    useID: string;
    surveyID: string;
}

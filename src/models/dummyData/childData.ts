import { IChild } from "../child.model";

export const dummyChildren: Partial<IChild>[] = [
  {
    name: "Aarav Patel",
    address: "45 Green Park, New Delhi, India 110016",
    gender: "male",
    survey_date: new Date("2024-12-01"),
    survey_attempt: 0,
    survey_status: "pending",
    survey_note: "Initial survey note for Aarav",
  },
  {
    name: "Ananya Sharma",
    address: "78 Bandra West, Mumbai, Maharashtra 400050",
    gender: "female",
    survey_date: new Date("2024-12-02"),
    survey_attempt: 0,
    survey_status: "pending",
    survey_note: "ignore this whole survey, he is annoying",
  },
  {
    name: "Arjun Singh",
    address: "23 Sector 14, Gurgaon, Haryana 122001",
    gender: "male",
    survey_date: new Date("2024-12-03"),
    survey_attempt: 0,
    survey_status: "pending",
  },
];

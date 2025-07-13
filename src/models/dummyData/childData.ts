import { IChild } from "../Child";

export const dummyChildren: Partial<IChild>[] = [
  {
    name: "Aarav Patel",
    address: "45 Green Park, New Delhi, India 110016",
    // observer_id and organisation_id will be set when created
    gender: "male",
    survey_date: new Date("2024-12-01"),
    attempt: 0,
    survey_status: "pending",
  },
  {
    name: "Ananya Sharma",
    address: "78 Bandra West, Mumbai, Maharashtra 400050",
    // observer_id and organisation_id will be set when created
    gender: "female",
    survey_date: new Date("2024-12-02"),
    attempt: 0,
    survey_status: "pending",
  },
  {
    name: "Arjun Singh",
    address: "23 Sector 14, Gurgaon, Haryana 122001",
    // observer_id and organisation_id will be set when created
    gender: "male",
    survey_date: new Date("2024-12-03"),
    attempt: 0,
    survey_status: "pending",
  },
];

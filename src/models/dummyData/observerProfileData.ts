import { IObserverProfile } from '../observer.profile.model';

export const dummyObserverProfiles: Partial<IObserverProfile>[] = [
  {
    // user_id and organisation_id will be set when created
    address: "Department of Psychology, Ashoka University, Sonipat",
    name: "Dr. Priya Sharma",
    email: "observer@example.com", // Will match the user email
    status: "active",
  },
  {
    // user_id and organisation_id will be set when created
    address: "Computer Science Department, IIT Bombay, Mumbai",
    name: "Dr. Rajesh Kumar",
    email: "observer2@iitbombay.ac.in", // Will match the user email
    status: "active",
  },
  {
    // user_id and organisation_id will be set when created
    address: "Bhishma Lab Research Center, New Delhi",
    name: "Dr. Anita Singh",
    email: "researcher@bhishmalab.com", // Will match the user email
    status: "active",
  }
];

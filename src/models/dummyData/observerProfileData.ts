import { IObserverProfile } from '../ObserverProfile';

export const dummyObserverProfiles: Partial<IObserverProfile>[] = [
  {
    // user_id and organisation_id will be set when created
    unique_id: "OB001",
    address: "Department of Psychology, Ashoka University, Sonipat",
    name: "Dr. Priya Sharma",
    status: "active",
  },
  {
    // user_id and organisation_id will be set when created
    unique_id: "OB002", 
    address: "Computer Science Department, IIT Bombay, Mumbai",
    name: "Dr. Rajesh Kumar",
    status: "active",
  },
  {
    // user_id and organisation_id will be set when created
    unique_id: "OB003",
    address: "Bhishma Lab Research Center, New Delhi",
    name: "Dr. Anita Singh",
    status: "active",
  }
];

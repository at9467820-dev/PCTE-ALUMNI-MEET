import { meetMedia } from "./interface";

export interface careerStep {
  year: string;
  role: string;
  company: string;
  location: string;
}

export interface Alumni {
  _id: string;
  name: string;
  profilePic: string;
  fileName: string;
  batch: string;
  linkedIn: string;
  email?: string;
  currentCompany: string;
  currentRole: string;
  careerTimeline: careerStep[];
  achievements: string[];
  quote?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface alumniMeetDocument {
  _id: string;
  title: string;
  time: Date | string;
  classJoined: string[];
  status: string;
  organizedBy: string;
  location: string;
  alumni: any;
  media: meetMedia;
  description: string;
  createdAt: Date | string;
  updatedAt?: string;
}

export interface feedback {
  _id: string;
  avatar: string;
  name: string;
  comment: string;
  company: string;
  createdAt: Date | string;
}

export interface userDocument {
  _id: string;
  name: string;
  email: string;
  password: string;
  phone?: string;
  avatar?: {
    url: string;
    public_id: string;
  };
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface blacklistInterface {
  _id: string;
  token: string;
  expiresAt: Date | string;
}
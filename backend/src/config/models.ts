import mongoose, { Schema, Document } from 'mongoose';

// ─── Alumni ──────────────────────────────────────────────────────────────────
const careerStepSchema = new Schema({
  year: { type: String, required: true },
  role: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, required: true },
}, { _id: false });

const alumniSchema = new Schema({
  name: { type: String, required: true },
  profilePic: { type: String, default: '' },
  fileName: { type: String, default: '' },
  batch: { type: String, required: true },
  linkedIn: { type: String, default: '' },
  email: { type: String, required: true, unique: true, lowercase: true },
  currentCompany: { type: String, required: true },
  currentRole: { type: String, required: true },
  careerTimeline: { type: [careerStepSchema], default: [] },
  achievements: { type: [String], default: [] },
  quote: { type: String, default: '' },
}, { timestamps: true });

export const AlumniModel = mongoose.models.Alumni || mongoose.model('Alumni', alumniSchema);

// ─── AlumniMeet ──────────────────────────────────────────────────────────────
const meetMediaSchema = new Schema({
  images: [{
    image: String,
    imageId: String,
  }],
  videoLink: { type: String, default: '' },
  videoId: { type: String, default: '' },
}, { _id: false });

const alumniMeetSchema = new Schema({
  title: { type: String, required: true },
  time: { type: Date, required: true },
  classJoined: { type: [String], default: [] },
  organizedBy: { type: String, required: true },
  location: { type: String, required: true },
  alumni: [{ type: Schema.Types.ObjectId, ref: 'Alumni' }],
  media: { type: meetMediaSchema, default: () => ({ images: [], videoLink: '', videoId: '' }) },
  status: { type: String, enum: ['Upcoming', 'Ongoing', 'Completed'], default: 'Upcoming' },
  description: { type: String, required: true },
}, { timestamps: true });

export const AlumniMeetModel = mongoose.models.AlumniMeet || mongoose.model('AlumniMeet', alumniMeetSchema);

// ─── User ─────────────────────────────────────────────────────────────────────
const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  phone: { type: String, default: '' },
  avatar: {
    url: { type: String, default: '' },
    public_id: { type: String, default: '' },
  },
}, { timestamps: true });

export const UserModel = mongoose.models.User || mongoose.model('User', userSchema);

// ─── Blacklist ─────────────────────────────────────────────────────────────────
const blacklistSchema = new Schema({
  token: { type: String, required: true, unique: true },
  expiresAt: { type: Date, required: true },
});

export const BlacklistModel = mongoose.models.Blacklist || mongoose.model('Blacklist', blacklistSchema);

// ─── Feedback ─────────────────────────────────────────────────────────────────
const feedbackSchema = new Schema({
  avatar: { type: String, default: '' },
  name: { type: String, required: true },
  company: { type: String, required: true },
  comment: { type: String, required: true },
}, { timestamps: true });

export const FeedbackModel = mongoose.models.Feedback || mongoose.model('Feedback', feedbackSchema);

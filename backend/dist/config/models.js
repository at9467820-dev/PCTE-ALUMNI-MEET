"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedbackModel = exports.BlacklistModel = exports.UserModel = exports.AlumniMeetModel = exports.AlumniModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
// ─── Alumni ──────────────────────────────────────────────────────────────────
const careerStepSchema = new mongoose_1.Schema({
    year: { type: String, required: true },
    role: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
}, { _id: false });
const alumniSchema = new mongoose_1.Schema({
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
exports.AlumniModel = mongoose_1.default.models.Alumni || mongoose_1.default.model('Alumni', alumniSchema);
// ─── AlumniMeet ──────────────────────────────────────────────────────────────
const meetMediaSchema = new mongoose_1.Schema({
    images: [{
            image: String,
            imageId: String,
        }],
    videoLink: { type: String, default: '' },
    videoId: { type: String, default: '' },
}, { _id: false });
const alumniMeetSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    time: { type: Date, required: true },
    classJoined: { type: [String], default: [] },
    organizedBy: { type: String, required: true },
    location: { type: String, required: true },
    alumni: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Alumni' }],
    media: { type: meetMediaSchema, default: () => ({ images: [], videoLink: '', videoId: '' }) },
    status: { type: String, enum: ['Upcoming', 'Ongoing', 'Completed'], default: 'Upcoming' },
    description: { type: String, required: true },
}, { timestamps: true });
exports.AlumniMeetModel = mongoose_1.default.models.AlumniMeet || mongoose_1.default.model('AlumniMeet', alumniMeetSchema);
// ─── User ─────────────────────────────────────────────────────────────────────
const userSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    phone: { type: String, default: '' },
    avatar: {
        url: { type: String, default: '' },
        public_id: { type: String, default: '' },
    },
}, { timestamps: true });
exports.UserModel = mongoose_1.default.models.User || mongoose_1.default.model('User', userSchema);
// ─── Blacklist ─────────────────────────────────────────────────────────────────
const blacklistSchema = new mongoose_1.Schema({
    token: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true },
});
exports.BlacklistModel = mongoose_1.default.models.Blacklist || mongoose_1.default.model('Blacklist', blacklistSchema);
// ─── Feedback ─────────────────────────────────────────────────────────────────
const feedbackSchema = new mongoose_1.Schema({
    avatar: { type: String, default: '' },
    name: { type: String, required: true },
    company: { type: String, required: true },
    comment: { type: String, required: true },
}, { timestamps: true });
exports.FeedbackModel = mongoose_1.default.models.Feedback || mongoose_1.default.model('Feedback', feedbackSchema);

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
exports.updateMeetStatusesDao = exports.getAllMeetsForReportDao = exports.getRandomFeedbacksDao = exports.getMeetsOnFrontendDao = exports.getRandomAlumniDao = exports.feedbackPaginationDao = exports.getTalksPaginationDao = exports.addFeedbackDao = exports.deleteAlumniMeetDao = exports.deleteMeetMediaDao = exports.updateMeetMediaDao = exports.updateAlumniMeetDao = exports.getAllAlumniMeetsDao = exports.createNewAlumniMeetDao = exports.updateAlumniDao = exports.findAlumniByIdDao = exports.deleteAlumniDao = exports.checkAlumniMeetsDaoByid = exports.checkAlumniMeetsDaoByAlumniId = exports.checkAlumniByIdDao = exports.addNewAlumniDao = exports.getAlumniById = exports.getAllAlumniDao = void 0;
const models_1 = require("../config/models");
// ─── Helpers ─────────────────────────────────────────────────────────────────
function toPlain(doc) {
    if (!doc)
        return doc;
    const obj = doc.toObject ? doc.toObject({ versionKey: false }) : { ...doc };
    if (obj._id)
        obj._id = obj._id.toString();
    return obj;
}
function toMeet(doc) {
    if (!doc)
        return doc;
    const obj = doc.toObject ? doc.toObject({ versionKey: false }) : { ...doc };
    obj._id = obj._id?.toString();
    if (Array.isArray(obj.alumni)) {
        obj.alumni = obj.alumni.map((a) => a && typeof a === 'object' && a._id ? { ...a, _id: a._id.toString() } : a?.toString?.() ?? a);
    }
    return obj;
}
// ─── Alumni DAOs ──────────────────────────────────────────────────────────────
const getAllAlumniDao = async () => {
    const docs = await models_1.AlumniModel.find().sort({ createdAt: -1 }).lean();
    return docs.map((d) => ({ ...d, _id: d._id.toString() }));
};
exports.getAllAlumniDao = getAllAlumniDao;
const getAlumniById = async (id) => {
    const doc = await models_1.AlumniModel.findById(id).lean();
    if (!doc)
        throw new Error('Alumni not found');
    return { ...doc, _id: doc._id.toString() };
};
exports.getAlumniById = getAlumniById;
const addNewAlumniDao = async (data) => {
    try {
        const doc = await models_1.AlumniModel.create({
            name: data.name,
            profilePic: data.profilePic?.toString() || '',
            fileName: data.fileName?.toString() || '',
            batch: data.batch,
            linkedIn: data.linkedIn || '',
            email: data.email,
            currentCompany: data.currentCompany,
            currentRole: data.currentRole,
            careerTimeline: data.careerTimeline || [],
            achievements: data.achievements || [],
            quote: data.quote || '',
        });
        return { ...toPlain(doc), _id: doc._id.toString() };
    }
    catch (err) {
        if (err.code === 11000)
            throw new Error(`Duplicate email found: ${data.email}`);
        throw err;
    }
};
exports.addNewAlumniDao = addNewAlumniDao;
const checkAlumniByIdDao = async (id) => {
    const doc = await models_1.AlumniModel.exists({ _id: id });
    return Boolean(doc);
};
exports.checkAlumniByIdDao = checkAlumniByIdDao;
const checkAlumniMeetsDaoByAlumniId = async (id) => {
    const doc = await models_1.AlumniMeetModel.exists({ alumni: id });
    return Boolean(doc);
};
exports.checkAlumniMeetsDaoByAlumniId = checkAlumniMeetsDaoByAlumniId;
const checkAlumniMeetsDaoByid = async (id) => {
    const doc = await models_1.AlumniMeetModel.exists({ _id: id });
    return Boolean(doc);
};
exports.checkAlumniMeetsDaoByid = checkAlumniMeetsDaoByid;
const deleteAlumniDao = async (id) => {
    const doc = await models_1.AlumniModel.findByIdAndDelete(id).lean();
    if (!doc)
        throw new Error('Alumni not found');
    return { ...doc, _id: doc._id.toString() };
};
exports.deleteAlumniDao = deleteAlumniDao;
const findAlumniByIdDao = async (id) => {
    const doc = await models_1.AlumniModel.findById(id).lean();
    if (!doc)
        return null;
    return { ...doc, _id: doc._id.toString() };
};
exports.findAlumniByIdDao = findAlumniByIdDao;
const updateAlumniDao = async (id, data) => {
    const doc = await models_1.AlumniModel.findByIdAndUpdate(id, {
        name: data.name,
        profilePic: data.profilePic ? String(data.profilePic) : undefined,
        fileName: data.fileName ? String(data.fileName) : undefined,
        batch: data.batch,
        linkedIn: data.linkedIn,
        email: data.email,
        currentCompany: data.currentCompany,
        currentRole: data.currentRole,
        careerTimeline: data.careerTimeline,
        achievements: data.achievements,
        quote: data.quote,
    }, { new: true, runValidators: true }).lean();
    if (!doc)
        return null;
    return { ...doc, _id: doc._id.toString() };
};
exports.updateAlumniDao = updateAlumniDao;
// ─── AlumniMeet DAOs ──────────────────────────────────────────────────────────
const createNewAlumniMeetDao = async (data) => {
    const alumniArray = Array.isArray(data.alumni) ? data.alumni : [data.alumni];
    const doc = await models_1.AlumniMeetModel.create({
        title: data.title,
        time: new Date(data.time),
        classJoined: data.classJoined || [],
        organizedBy: data.organizedBy,
        location: data.location,
        alumni: alumniArray,
        media: data.media || { images: [], videoLink: '', videoId: '' },
        status: 'Upcoming',
        description: data.description,
    });
    return toMeet(doc);
};
exports.createNewAlumniMeetDao = createNewAlumniMeetDao;
const getAllAlumniMeetsDao = async () => {
    const docs = await models_1.AlumniMeetModel.find().sort({ createdAt: -1 }).populate('alumni').lean();
    if (!docs || docs.length === 0)
        throw new Error('Alumni Meets not found');
    return docs.map((d) => toMeet({ toObject: () => d }));
};
exports.getAllAlumniMeetsDao = getAllAlumniMeetsDao;
const updateAlumniMeetDao = async (id, data, talkImages, talkVideo, deleteImages) => {
    const existing = await models_1.AlumniMeetModel.findById(id);
    if (!existing)
        throw new Error('Alumni Meet not found');
    const alumniArray = data.alumni
        ? (Array.isArray(data.alumni) ? data.alumni : [data.alumni])
        : existing.alumni;
    let imgs = existing.media?.images || [];
    if (talkImages && Array.isArray(talkImages) && talkImages.length > 0)
        imgs = [...imgs, ...talkImages];
    if (deleteImages && deleteImages.length > 0)
        imgs = imgs.filter((img) => !deleteImages.includes(img.imageId));
    let vLink = existing.media?.videoLink || '';
    let vId = existing.media?.videoId || '';
    if (talkVideo && talkVideo.videoLink) {
        vLink = talkVideo.videoLink;
        vId = talkVideo.videoId;
    }
    const updated = await models_1.AlumniMeetModel.findByIdAndUpdate(id, {
        title: data.title || existing.title,
        time: data.time ? new Date(data.time) : existing.time,
        classJoined: data.classJoined || existing.classJoined,
        organizedBy: data.organizedBy || existing.organizedBy,
        location: data.location || existing.location,
        alumni: alumniArray,
        'media.images': imgs,
        'media.videoLink': vLink,
        'media.videoId': vId,
        description: data.description || existing.description,
    }, { new: true }).lean();
    return toMeet({ toObject: () => updated });
};
exports.updateAlumniMeetDao = updateAlumniMeetDao;
const updateMeetMediaDao = async (images, video, videoId, id) => {
    const existing = await models_1.AlumniMeetModel.findById(id);
    if (!existing)
        throw new Error('Alumni Meet not found');
    const oldVideoId = existing.media?.videoId || '';
    let imgs = existing.media?.images || [];
    if (images && images.length > 0)
        imgs = [...imgs, ...images];
    let vLink = existing.media?.videoLink || '';
    let vId = existing.media?.videoId || '';
    if (video) {
        vLink = video;
        vId = videoId;
    }
    const updated = await models_1.AlumniMeetModel.findByIdAndUpdate(id, {
        'media.images': imgs,
        'media.videoLink': vLink,
        'media.videoId': vId,
    }, { new: true }).lean();
    const result = toMeet({ toObject: () => updated });
    result._oldVideoId = oldVideoId;
    return result;
};
exports.updateMeetMediaDao = updateMeetMediaDao;
const deleteMeetMediaDao = async (imageIds, id) => {
    const existing = await models_1.AlumniMeetModel.findById(id);
    if (!existing)
        throw new Error('Alumni Meet not found');
    const imgs = (existing.media?.images || []).filter((img) => !imageIds.includes(img.imageId));
    const updated = await models_1.AlumniMeetModel.findByIdAndUpdate(id, { 'media.images': imgs }, { new: true }).lean();
    return toMeet({ toObject: () => updated });
};
exports.deleteMeetMediaDao = deleteMeetMediaDao;
const deleteAlumniMeetDao = async (id) => {
    const doc = await models_1.AlumniMeetModel.findByIdAndDelete(id).populate('alumni').lean();
    if (!doc)
        throw new Error('Deletion failed. Alumni Meet may have already been deleted.');
    return toMeet({ toObject: () => doc });
};
exports.deleteAlumniMeetDao = deleteAlumniMeetDao;
const addFeedbackDao = async (name, company, comment) => {
    const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&size=128&bold=true&rounded=true`;
    const doc = await models_1.FeedbackModel.create({ avatar, name, company, comment });
    return { ...toPlain(doc), _id: doc._id.toString() };
};
exports.addFeedbackDao = addFeedbackDao;
const getTalksPaginationDao = async (page, limit, now) => {
    const skip = (page - 1) * limit;
    const [talks, total] = await Promise.all([
        models_1.AlumniMeetModel.find({ time: { $lte: now } }).sort({ createdAt: -1 }).skip(skip).limit(limit).populate('alumni').lean(),
        models_1.AlumniMeetModel.countDocuments({ time: { $lte: now } }),
    ]);
    return { talks: talks.map((d) => toMeet({ toObject: () => d })), total };
};
exports.getTalksPaginationDao = getTalksPaginationDao;
const feedbackPaginationDao = async (page, limit) => {
    const skip = (page - 1) * limit;
    const [feedbacks, total] = await Promise.all([
        models_1.FeedbackModel.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
        models_1.FeedbackModel.countDocuments(),
    ]);
    return {
        feedbacks: feedbacks.map((d) => ({ ...d, _id: d._id.toString() })),
        total,
    };
};
exports.feedbackPaginationDao = feedbackPaginationDao;
const getRandomAlumniDao = async (count) => {
    const docs = await models_1.AlumniModel.aggregate([{ $sample: { size: count } }]);
    return docs.map((d) => ({ ...d, _id: d._id.toString() }));
};
exports.getRandomAlumniDao = getRandomAlumniDao;
const getMeetsOnFrontendDao = async (type) => {
    const now = new Date();
    let docs = [];
    if (type === 'randomUpcomings')
        docs = await models_1.AlumniMeetModel.aggregate([{ $match: { time: { $gt: now } } }, { $sample: { size: 1 } }]);
    else if (type === 'allUpcomings')
        docs = await models_1.AlumniMeetModel.find({ time: { $gt: now } }).lean();
    else if (type === 'randomPast')
        docs = await models_1.AlumniMeetModel.aggregate([{ $match: { time: { $lt: now } } }, { $sample: { size: 3 } }]);
    else if (type === 'allPast')
        docs = await models_1.AlumniMeetModel.find({ time: { $lt: now } }).lean();
    // Populate alumni for aggregation results
    const populated = await Promise.all(docs.map(async (d) => {
        if (d.alumni && d.alumni.length > 0) {
            const { AlumniModel: AM } = await Promise.resolve().then(() => __importStar(require('../config/models')));
            const alumniDocs = await AM.find({ _id: { $in: d.alumni } }).lean();
            d.alumni = alumniDocs.map((a) => ({ ...a, _id: a._id.toString() }));
        }
        return toMeet({ toObject: () => d });
    }));
    return populated;
};
exports.getMeetsOnFrontendDao = getMeetsOnFrontendDao;
const getRandomFeedbacksDao = async (count) => {
    const docs = await models_1.FeedbackModel.aggregate([{ $sample: { size: count } }]);
    return docs.map((d) => ({ ...d, _id: d._id.toString() }));
};
exports.getRandomFeedbacksDao = getRandomFeedbacksDao;
const getAllMeetsForReportDao = async () => {
    const docs = await models_1.AlumniMeetModel.find().sort({ createdAt: 1 }).populate('alumni').lean();
    return docs.map((d) => toMeet({ toObject: () => d }));
};
exports.getAllMeetsForReportDao = getAllMeetsForReportDao;
const updateMeetStatusesDao = async () => {
    const now = new Date();
    await models_1.AlumniMeetModel.updateMany({ time: { $lt: now }, status: { $in: ['Upcoming', 'Ongoing'] } }, { $set: { status: 'Completed' } });
};
exports.updateMeetStatusesDao = updateMeetStatusesDao;

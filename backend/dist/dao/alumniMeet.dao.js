"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMeetStatusesDao = exports.getAllMeetsForReportDao = exports.getRandomFeedbacksDao = exports.getMeetsOnFrontendDao = exports.getRandomAlumniDao = exports.feedbackPaginationDao = exports.getTalksPaginationDao = exports.addFeedbackDao = exports.deleteAlumniMeetDao = exports.deleteMeetMediaDao = exports.updateMeetMediaDao = exports.updateAlumniMeetDao = exports.getAllAlumniMeetsDao = exports.createNewAlumniMeetDao = exports.updateAlumniDao = exports.findAlumniByIdDao = exports.deleteAlumniDao = exports.checkAlumniMeetsDaoByid = exports.checkAlumniMeetsDaoByAlumniId = exports.checkAlumniByIdDao = exports.addNewAlumniDao = exports.getAlumniById = exports.getAllAlumniDao = void 0;
const database_1 = __importDefault(require("../config/database"));
const crypto_1 = require("crypto");
function parseAlumniRow(row) {
    if (!row)
        return row;
    return { ...row, careerTimeline: JSON.parse(row.careerTimeline || '[]'), achievements: JSON.parse(row.achievements || '[]') };
}
function parseMeetRow(row) {
    if (!row)
        return row;
    return {
        ...row,
        classJoined: JSON.parse(row.classJoined || '[]'),
        alumni: JSON.parse(row.alumni || '[]'),
        media: { images: JSON.parse(row.media_images || '[]'), videoLink: row.media_videoLink || '', videoId: row.media_videoId || '' },
    };
}
function populateMeetAlumni(meet) {
    const alumniIds = meet.alumni;
    if (Array.isArray(alumniIds) && alumniIds.length > 0) {
        const placeholders = alumniIds.map(() => '?').join(',');
        const rows = database_1.default.prepare(`SELECT * FROM alumni WHERE _id IN (${placeholders})`).all(...alumniIds);
        meet.alumni = rows.map(parseAlumniRow);
    }
    else {
        meet.alumni = [];
    }
    return meet;
}
const getAllAlumniDao = async () => {
    const rows = database_1.default.prepare('SELECT * FROM alumni ORDER BY createdAt DESC').all();
    return rows.map(parseAlumniRow);
};
exports.getAllAlumniDao = getAllAlumniDao;
const getAlumniById = async (id) => {
    const row = database_1.default.prepare('SELECT * FROM alumni WHERE _id = ?').get(id);
    if (!row)
        throw new Error('Alumni not found');
    return parseAlumniRow(row);
};
exports.getAlumniById = getAlumniById;
const addNewAlumniDao = async (data) => {
    const _id = (0, crypto_1.randomUUID)();
    const now = new Date().toISOString();
    try {
        database_1.default.prepare(`INSERT INTO alumni (_id,name,profilePic,fileName,batch,linkedIn,email,currentCompany,currentRole,careerTimeline,achievements,quote,createdAt,updatedAt) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`).run(_id, data.name, data.profilePic?.toString() || '', data.fileName?.toString() || '', data.batch, data.linkedIn || '', data.email, data.currentCompany, data.currentRole, JSON.stringify(data.careerTimeline || []), JSON.stringify(data.achievements || []), data.quote || '', now, now);
        return parseAlumniRow(database_1.default.prepare('SELECT * FROM alumni WHERE _id = ?').get(_id));
    }
    catch (err) {
        if (err.message?.includes('UNIQUE constraint failed: alumni.email'))
            throw new Error(`Duplicate email found: ${data.email}`);
        throw err;
    }
};
exports.addNewAlumniDao = addNewAlumniDao;
const checkAlumniByIdDao = async (id) => {
    return Boolean(database_1.default.prepare('SELECT _id FROM alumni WHERE _id = ?').get(id));
};
exports.checkAlumniByIdDao = checkAlumniByIdDao;
const checkAlumniMeetsDaoByAlumniId = async (id) => {
    const rows = database_1.default.prepare('SELECT alumni FROM alumniMeets').all();
    for (const row of rows) {
        const ids = JSON.parse(row.alumni || '[]');
        if (ids.includes(id))
            return true;
    }
    return false;
};
exports.checkAlumniMeetsDaoByAlumniId = checkAlumniMeetsDaoByAlumniId;
const checkAlumniMeetsDaoByid = async (id) => {
    return Boolean(database_1.default.prepare('SELECT _id FROM alumniMeets WHERE _id = ?').get(id));
};
exports.checkAlumniMeetsDaoByid = checkAlumniMeetsDaoByid;
const deleteAlumniDao = async (id) => {
    const existing = database_1.default.prepare('SELECT * FROM alumni WHERE _id = ?').get(id);
    if (!existing)
        throw new Error('Alumni not found');
    database_1.default.prepare('DELETE FROM alumni WHERE _id = ?').run(id);
    return parseAlumniRow(existing);
};
exports.deleteAlumniDao = deleteAlumniDao;
const findAlumniByIdDao = async (id) => {
    const row = database_1.default.prepare('SELECT * FROM alumni WHERE _id = ?').get(id);
    return row ? parseAlumniRow(row) : null;
};
exports.findAlumniByIdDao = findAlumniByIdDao;
const updateAlumniDao = async (id, data) => {
    const now = new Date().toISOString();
    const existing = database_1.default.prepare('SELECT * FROM alumni WHERE _id = ?').get(id);
    if (!existing)
        return null;
    database_1.default.prepare(`UPDATE alumni SET name=?, profilePic=?, fileName=?, batch=?, linkedIn=?, email=?, currentCompany=?, currentRole=?, careerTimeline=?, achievements=?, quote=?, updatedAt=? WHERE _id=?`).run(data.name || existing.name, data.profilePic ? String(data.profilePic) : existing.profilePic, data.fileName ? String(data.fileName) : existing.fileName, data.batch || existing.batch, data.linkedIn !== undefined ? data.linkedIn : existing.linkedIn, data.email || existing.email, data.currentCompany || existing.currentCompany, data.currentRole || existing.currentRole, JSON.stringify(data.careerTimeline || JSON.parse(existing.careerTimeline)), JSON.stringify(data.achievements || JSON.parse(existing.achievements)), data.quote !== undefined ? data.quote : existing.quote, now, id);
    return parseAlumniRow(database_1.default.prepare('SELECT * FROM alumni WHERE _id = ?').get(id));
};
exports.updateAlumniDao = updateAlumniDao;
const createNewAlumniMeetDao = async (data) => {
    const _id = (0, crypto_1.randomUUID)();
    const now = new Date().toISOString();
    const alumniArray = Array.isArray(data.alumni) ? data.alumni : [data.alumni];
    database_1.default.prepare(`INSERT INTO alumniMeets (_id,title,time,classJoined,organizedBy,location,alumni,media_images,media_videoLink,media_videoId,status,description,createdAt,updatedAt) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`).run(_id, data.title, new Date(data.time).toISOString(), JSON.stringify(data.classJoined || []), data.organizedBy, data.location, JSON.stringify(alumniArray), JSON.stringify(data.media?.images || []), data.media?.videoLink || '', data.media?.videoId || '', 'Upcoming', data.description, now, now);
    return parseMeetRow(database_1.default.prepare('SELECT * FROM alumniMeets WHERE _id = ?').get(_id));
};
exports.createNewAlumniMeetDao = createNewAlumniMeetDao;
const getAllAlumniMeetsDao = async () => {
    const rows = database_1.default.prepare('SELECT * FROM alumniMeets ORDER BY createdAt DESC').all();
    if (!rows || rows.length === 0)
        throw new Error('Alumni Meets not found');
    return rows.map(parseMeetRow).map(populateMeetAlumni);
};
exports.getAllAlumniMeetsDao = getAllAlumniMeetsDao;
const updateAlumniMeetDao = async (id, data, talkImages, talkVideo, deleteImages) => {
    const existing = database_1.default.prepare('SELECT * FROM alumniMeets WHERE _id = ?').get(id);
    if (!existing)
        throw new Error('Alumni Meet not found');
    const now = new Date().toISOString();
    const meet = parseMeetRow(existing);
    const alumniArray = data.alumni ? (Array.isArray(data.alumni) ? data.alumni : [data.alumni]) : meet.alumni;
    let imgs = meet.media.images || [];
    if (talkImages && Array.isArray(talkImages) && talkImages.length > 0)
        imgs = [...imgs, ...talkImages];
    if (deleteImages && deleteImages.length > 0)
        imgs = imgs.filter((img) => !deleteImages.includes(img.imageId));
    let vLink = meet.media.videoLink || '', vId = meet.media.videoId || '';
    if (talkVideo && talkVideo.videoLink) {
        vLink = talkVideo.videoLink;
        vId = talkVideo.videoId;
    }
    database_1.default.prepare(`UPDATE alumniMeets SET title=?,time=?,classJoined=?,organizedBy=?,location=?,alumni=?,media_images=?,media_videoLink=?,media_videoId=?,description=?,updatedAt=? WHERE _id=?`).run(data.title || meet.title, data.time ? new Date(data.time).toISOString() : existing.time, JSON.stringify(data.classJoined || meet.classJoined), data.organizedBy || meet.organizedBy, data.location || meet.location, JSON.stringify(alumniArray), JSON.stringify(imgs), vLink, vId, data.description || meet.description, now, id);
    return parseMeetRow(database_1.default.prepare('SELECT * FROM alumniMeets WHERE _id = ?').get(id));
};
exports.updateAlumniMeetDao = updateAlumniMeetDao;
const updateMeetMediaDao = async (images, video, videoId, id) => {
    const existing = database_1.default.prepare('SELECT * FROM alumniMeets WHERE _id = ?').get(id);
    if (!existing)
        throw new Error('Alumni Meet not found');
    const meet = parseMeetRow(existing);
    const now = new Date().toISOString();
    let imgs = meet.media.images || [];
    if (images && images.length > 0)
        imgs = [...imgs, ...images];
    let vLink = meet.media.videoLink || '', vId = meet.media.videoId || '';
    const oldVideoId = vId;
    if (video) {
        vLink = video;
        vId = videoId;
    }
    database_1.default.prepare(`UPDATE alumniMeets SET media_images=?,media_videoLink=?,media_videoId=?,updatedAt=? WHERE _id=?`).run(JSON.stringify(imgs), vLink, vId, now, id);
    const updated = parseMeetRow(database_1.default.prepare('SELECT * FROM alumniMeets WHERE _id = ?').get(id));
    updated._oldVideoId = oldVideoId;
    return updated;
};
exports.updateMeetMediaDao = updateMeetMediaDao;
const deleteMeetMediaDao = async (imageIds, id) => {
    const existing = database_1.default.prepare('SELECT * FROM alumniMeets WHERE _id = ?').get(id);
    if (!existing)
        throw new Error('Alumni Meet not found');
    const meet = parseMeetRow(existing);
    const now = new Date().toISOString();
    const imgs = meet.media.images.filter((img) => !imageIds.includes(img.imageId));
    database_1.default.prepare(`UPDATE alumniMeets SET media_images=?,updatedAt=? WHERE _id=?`).run(JSON.stringify(imgs), now, id);
    return parseMeetRow(database_1.default.prepare('SELECT * FROM alumniMeets WHERE _id = ?').get(id));
};
exports.deleteMeetMediaDao = deleteMeetMediaDao;
const deleteAlumniMeetDao = async (id) => {
    const existing = database_1.default.prepare('SELECT * FROM alumniMeets WHERE _id = ?').get(id);
    if (!existing)
        throw new Error('Deletion failed. Alumni Meet may have already been deleted.');
    database_1.default.prepare('DELETE FROM alumniMeets WHERE _id = ?').run(id);
    return parseMeetRow(existing);
};
exports.deleteAlumniMeetDao = deleteAlumniMeetDao;
const addFeedbackDao = async (name, company, comment) => {
    const _id = (0, crypto_1.randomUUID)();
    const now = new Date().toISOString();
    const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&size=128&bold=true&rounded=true`;
    database_1.default.prepare(`INSERT INTO feedback (_id,avatar,name,company,comment,createdAt,updatedAt) VALUES (?,?,?,?,?,?,?)`).run(_id, avatar, name, company, comment, now, now);
    return database_1.default.prepare('SELECT * FROM feedback WHERE _id = ?').get(_id);
};
exports.addFeedbackDao = addFeedbackDao;
const getTalksPaginationDao = async (page, limit, now) => {
    const skip = (page - 1) * limit;
    const nowISO = now.toISOString();
    const talks = database_1.default.prepare('SELECT * FROM alumniMeets WHERE time <= ? ORDER BY createdAt DESC LIMIT ? OFFSET ?').all(nowISO, limit, skip);
    const totalRow = database_1.default.prepare('SELECT COUNT(*) as count FROM alumniMeets WHERE time <= ?').get(nowISO);
    const parsedTalks = talks.map(parseMeetRow).map(populateMeetAlumni);
    return { talks: parsedTalks, total: totalRow.count };
};
exports.getTalksPaginationDao = getTalksPaginationDao;
const feedbackPaginationDao = async (page, limit) => {
    const skip = (page - 1) * limit;
    const feedbacks = database_1.default.prepare('SELECT * FROM feedback ORDER BY createdAt DESC LIMIT ? OFFSET ?').all(limit, skip);
    const totalRow = database_1.default.prepare('SELECT COUNT(*) as count FROM feedback').get();
    return { feedbacks, total: totalRow.count };
};
exports.feedbackPaginationDao = feedbackPaginationDao;
// New DAOs for controller functions that previously used Mongoose directly
const getRandomAlumniDao = async (count) => {
    const rows = database_1.default.prepare('SELECT * FROM alumni ORDER BY RANDOM() LIMIT ?').all(count);
    return rows.map(parseAlumniRow);
};
exports.getRandomAlumniDao = getRandomAlumniDao;
const getMeetsOnFrontendDao = async (type) => {
    const nowISO = new Date().toISOString();
    let rows;
    if (type === 'randomUpcomings')
        rows = database_1.default.prepare('SELECT * FROM alumniMeets WHERE time > ? ORDER BY RANDOM() LIMIT 1').all(nowISO);
    else if (type === 'allUpcomings')
        rows = database_1.default.prepare('SELECT * FROM alumniMeets WHERE time > ?').all(nowISO);
    else if (type === 'randomPast')
        rows = database_1.default.prepare('SELECT * FROM alumniMeets WHERE time < ? ORDER BY RANDOM() LIMIT 3').all(nowISO);
    else if (type === 'allPast')
        rows = database_1.default.prepare('SELECT * FROM alumniMeets WHERE time < ?').all(nowISO);
    else
        rows = [];
    return rows.map(parseMeetRow).map(populateMeetAlumni);
};
exports.getMeetsOnFrontendDao = getMeetsOnFrontendDao;
const getRandomFeedbacksDao = async (count) => {
    return database_1.default.prepare('SELECT * FROM feedback ORDER BY RANDOM() LIMIT ?').all(count);
};
exports.getRandomFeedbacksDao = getRandomFeedbacksDao;
const getAllMeetsForReportDao = async () => {
    const rows = database_1.default.prepare('SELECT * FROM alumniMeets ORDER BY createdAt ASC').all();
    return rows.map(parseMeetRow).map(populateMeetAlumni);
};
exports.getAllMeetsForReportDao = getAllMeetsForReportDao;
const updateMeetStatusesDao = async () => {
    const nowISO = new Date().toISOString();
    database_1.default.prepare("UPDATE alumniMeets SET status='Completed' WHERE time < ? AND status IN ('Upcoming','Ongoing')").run(nowISO);
};
exports.updateMeetStatusesDao = updateMeetStatusesDao;

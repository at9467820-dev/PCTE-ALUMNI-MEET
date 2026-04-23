import db from '../config/database';
import { randomUUID } from 'crypto';
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
        const rows = db.prepare(`SELECT * FROM alumni WHERE _id IN (${placeholders})`).all(...alumniIds);
        meet.alumni = rows.map(parseAlumniRow);
    }
    else {
        meet.alumni = [];
    }
    return meet;
}
export const getAllAlumniDao = async () => {
    const rows = db.prepare('SELECT * FROM alumni ORDER BY createdAt DESC').all();
    return rows.map(parseAlumniRow);
};
export const getAlumniById = async (id) => {
    const row = db.prepare('SELECT * FROM alumni WHERE _id = ?').get(id);
    if (!row)
        throw new Error('Alumni not found');
    return parseAlumniRow(row);
};
export const addNewAlumniDao = async (data) => {
    const _id = randomUUID();
    const now = new Date().toISOString();
    try {
        db.prepare(`INSERT INTO alumni (_id,name,profilePic,fileName,batch,linkedIn,email,currentCompany,currentRole,careerTimeline,achievements,quote,createdAt,updatedAt) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`).run(_id, data.name, data.profilePic?.toString() || '', data.fileName?.toString() || '', data.batch, data.linkedIn || '', data.email, data.currentCompany, data.currentRole, JSON.stringify(data.careerTimeline || []), JSON.stringify(data.achievements || []), data.quote || '', now, now);
        return parseAlumniRow(db.prepare('SELECT * FROM alumni WHERE _id = ?').get(_id));
    }
    catch (err) {
        if (err.message?.includes('UNIQUE constraint failed: alumni.email'))
            throw new Error(`Duplicate email found: ${data.email}`);
        throw err;
    }
};
export const checkAlumniByIdDao = async (id) => {
    return Boolean(db.prepare('SELECT _id FROM alumni WHERE _id = ?').get(id));
};
export const checkAlumniMeetsDaoByAlumniId = async (id) => {
    const rows = db.prepare('SELECT alumni FROM alumniMeets').all();
    for (const row of rows) {
        const ids = JSON.parse(row.alumni || '[]');
        if (ids.includes(id))
            return true;
    }
    return false;
};
export const checkAlumniMeetsDaoByid = async (id) => {
    return Boolean(db.prepare('SELECT _id FROM alumniMeets WHERE _id = ?').get(id));
};
export const deleteAlumniDao = async (id) => {
    const existing = db.prepare('SELECT * FROM alumni WHERE _id = ?').get(id);
    if (!existing)
        throw new Error('Alumni not found');
    db.prepare('DELETE FROM alumni WHERE _id = ?').run(id);
    return parseAlumniRow(existing);
};
export const findAlumniByIdDao = async (id) => {
    const row = db.prepare('SELECT * FROM alumni WHERE _id = ?').get(id);
    return row ? parseAlumniRow(row) : null;
};
export const updateAlumniDao = async (id, data) => {
    const now = new Date().toISOString();
    const existing = db.prepare('SELECT * FROM alumni WHERE _id = ?').get(id);
    if (!existing)
        return null;
    db.prepare(`UPDATE alumni SET name=?, profilePic=?, fileName=?, batch=?, linkedIn=?, email=?, currentCompany=?, currentRole=?, careerTimeline=?, achievements=?, quote=?, updatedAt=? WHERE _id=?`).run(data.name || existing.name, data.profilePic ? String(data.profilePic) : existing.profilePic, data.fileName ? String(data.fileName) : existing.fileName, data.batch || existing.batch, data.linkedIn !== undefined ? data.linkedIn : existing.linkedIn, data.email || existing.email, data.currentCompany || existing.currentCompany, data.currentRole || existing.currentRole, JSON.stringify(data.careerTimeline || JSON.parse(existing.careerTimeline)), JSON.stringify(data.achievements || JSON.parse(existing.achievements)), data.quote !== undefined ? data.quote : existing.quote, now, id);
    return parseAlumniRow(db.prepare('SELECT * FROM alumni WHERE _id = ?').get(id));
};
export const createNewAlumniMeetDao = async (data) => {
    const _id = randomUUID();
    const now = new Date().toISOString();
    const alumniArray = Array.isArray(data.alumni) ? data.alumni : [data.alumni];
    db.prepare(`INSERT INTO alumniMeets (_id,title,time,classJoined,organizedBy,location,alumni,media_images,media_videoLink,media_videoId,status,description,createdAt,updatedAt) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`).run(_id, data.title, new Date(data.time).toISOString(), JSON.stringify(data.classJoined || []), data.organizedBy, data.location, JSON.stringify(alumniArray), JSON.stringify(data.media?.images || []), data.media?.videoLink || '', data.media?.videoId || '', 'Upcoming', data.description, now, now);
    return parseMeetRow(db.prepare('SELECT * FROM alumniMeets WHERE _id = ?').get(_id));
};
export const getAllAlumniMeetsDao = async () => {
    const rows = db.prepare('SELECT * FROM alumniMeets ORDER BY createdAt DESC').all();
    if (!rows || rows.length === 0)
        throw new Error('Alumni Meets not found');
    return rows.map(parseMeetRow).map(populateMeetAlumni);
};
export const updateAlumniMeetDao = async (id, data, talkImages, talkVideo, deleteImages) => {
    const existing = db.prepare('SELECT * FROM alumniMeets WHERE _id = ?').get(id);
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
    db.prepare(`UPDATE alumniMeets SET title=?,time=?,classJoined=?,organizedBy=?,location=?,alumni=?,media_images=?,media_videoLink=?,media_videoId=?,description=?,updatedAt=? WHERE _id=?`).run(data.title || meet.title, data.time ? new Date(data.time).toISOString() : existing.time, JSON.stringify(data.classJoined || meet.classJoined), data.organizedBy || meet.organizedBy, data.location || meet.location, JSON.stringify(alumniArray), JSON.stringify(imgs), vLink, vId, data.description || meet.description, now, id);
    return parseMeetRow(db.prepare('SELECT * FROM alumniMeets WHERE _id = ?').get(id));
};
export const updateMeetMediaDao = async (images, video, videoId, id) => {
    const existing = db.prepare('SELECT * FROM alumniMeets WHERE _id = ?').get(id);
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
    db.prepare(`UPDATE alumniMeets SET media_images=?,media_videoLink=?,media_videoId=?,updatedAt=? WHERE _id=?`).run(JSON.stringify(imgs), vLink, vId, now, id);
    const updated = parseMeetRow(db.prepare('SELECT * FROM alumniMeets WHERE _id = ?').get(id));
    updated._oldVideoId = oldVideoId;
    return updated;
};
export const deleteMeetMediaDao = async (imageIds, id) => {
    const existing = db.prepare('SELECT * FROM alumniMeets WHERE _id = ?').get(id);
    if (!existing)
        throw new Error('Alumni Meet not found');
    const meet = parseMeetRow(existing);
    const now = new Date().toISOString();
    const imgs = meet.media.images.filter((img) => !imageIds.includes(img.imageId));
    db.prepare(`UPDATE alumniMeets SET media_images=?,updatedAt=? WHERE _id=?`).run(JSON.stringify(imgs), now, id);
    return parseMeetRow(db.prepare('SELECT * FROM alumniMeets WHERE _id = ?').get(id));
};
export const deleteAlumniMeetDao = async (id) => {
    const existing = db.prepare('SELECT * FROM alumniMeets WHERE _id = ?').get(id);
    if (!existing)
        throw new Error('Deletion failed. Alumni Meet may have already been deleted.');
    db.prepare('DELETE FROM alumniMeets WHERE _id = ?').run(id);
    return parseMeetRow(existing);
};
export const addFeedbackDao = async (name, company, comment) => {
    const _id = randomUUID();
    const now = new Date().toISOString();
    const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&size=128&bold=true&rounded=true`;
    db.prepare(`INSERT INTO feedback (_id,avatar,name,company,comment,createdAt,updatedAt) VALUES (?,?,?,?,?,?,?)`).run(_id, avatar, name, company, comment, now, now);
    return db.prepare('SELECT * FROM feedback WHERE _id = ?').get(_id);
};
export const getTalksPaginationDao = async (page, limit, now) => {
    const skip = (page - 1) * limit;
    const nowISO = now.toISOString();
    const talks = db.prepare('SELECT * FROM alumniMeets WHERE time <= ? ORDER BY createdAt DESC LIMIT ? OFFSET ?').all(nowISO, limit, skip);
    const totalRow = db.prepare('SELECT COUNT(*) as count FROM alumniMeets WHERE time <= ?').get(nowISO);
    const parsedTalks = talks.map(parseMeetRow).map(populateMeetAlumni);
    return { talks: parsedTalks, total: totalRow.count };
};
export const feedbackPaginationDao = async (page, limit) => {
    const skip = (page - 1) * limit;
    const feedbacks = db.prepare('SELECT * FROM feedback ORDER BY createdAt DESC LIMIT ? OFFSET ?').all(limit, skip);
    const totalRow = db.prepare('SELECT COUNT(*) as count FROM feedback').get();
    return { feedbacks, total: totalRow.count };
};
// New DAOs for controller functions that previously used Mongoose directly
export const getRandomAlumniDao = async (count) => {
    const rows = db.prepare('SELECT * FROM alumni ORDER BY RANDOM() LIMIT ?').all(count);
    return rows.map(parseAlumniRow);
};
export const getMeetsOnFrontendDao = async (type) => {
    const nowISO = new Date().toISOString();
    let rows;
    if (type === 'randomUpcomings')
        rows = db.prepare('SELECT * FROM alumniMeets WHERE time > ? ORDER BY RANDOM() LIMIT 1').all(nowISO);
    else if (type === 'allUpcomings')
        rows = db.prepare('SELECT * FROM alumniMeets WHERE time > ?').all(nowISO);
    else if (type === 'randomPast')
        rows = db.prepare('SELECT * FROM alumniMeets WHERE time < ? ORDER BY RANDOM() LIMIT 3').all(nowISO);
    else if (type === 'allPast')
        rows = db.prepare('SELECT * FROM alumniMeets WHERE time < ?').all(nowISO);
    else
        rows = [];
    return rows.map(parseMeetRow).map(populateMeetAlumni);
};
export const getRandomFeedbacksDao = async (count) => {
    return db.prepare('SELECT * FROM feedback ORDER BY RANDOM() LIMIT ?').all(count);
};
export const getAllMeetsForReportDao = async () => {
    const rows = db.prepare('SELECT * FROM alumniMeets ORDER BY createdAt ASC').all();
    return rows.map(parseMeetRow).map(populateMeetAlumni);
};
export const updateMeetStatusesDao = async () => {
    const nowISO = new Date().toISOString();
    db.prepare("UPDATE alumniMeets SET status='Completed' WHERE time < ? AND status IN ('Upcoming','Ongoing')").run(nowISO);
};

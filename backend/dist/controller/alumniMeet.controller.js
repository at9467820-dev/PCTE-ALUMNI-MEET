"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.feedbackPagination = exports.getTalksPagination = exports.fetchRandomFeedbacks = exports.addNewFeedback = exports.getSomeRandomAlumni = exports.getMeetsOnFrontend = exports.deleteAlumniMeet = exports.deleteMeetMedia = exports.updateMeetMedia = exports.updateAlumniMeet = exports.getAllAlumniMeets = exports.addNewAlumniMeet = exports.deleteAlumni = exports.updateAlumni = exports.addNewAlumni = exports.getAllAlumni = void 0;
const alumniMeet_service_1 = require("../services/alumniMeet.service");
const cloudnaryDeletion_1 = require("../utility/cloudnaryDeletion");
const alumniMeet_dao_1 = require("../dao/alumniMeet.dao");
const getAllAlumni = async (req, res, next) => {
    try {
        res.status(200).json(await (0, alumniMeet_service_1.getAllAlumniListService)());
    }
    catch (err) {
        next(err);
    }
};
exports.getAllAlumni = getAllAlumni;
const addNewAlumni = async (req, res, next) => {
    try {
        const data = req.body;
        const file = req.file;
        const parsedCareerTimeline = JSON.parse(data.careerTimeline);
        const parsedAchievements = JSON.parse(data.achievement);
        let profilePicUrl, fileName;
        if (file) {
            profilePicUrl = file.path;
            fileName = file.filename;
        }
        const alumniInput = {
            ...data, careerTimeline: parsedCareerTimeline, achievements: parsedAchievements,
            ...(profilePicUrl && { profilePic: profilePicUrl, fileName }),
        };
        const newAlumni = await (0, alumniMeet_service_1.addNewAlumniService)(alumniInput);
        return res.status(200).json({ success: true, message: "Alumni added successfully", data: newAlumni });
    }
    catch (err) {
        next(err);
    }
};
exports.addNewAlumni = addNewAlumni;
const updateAlumni = async (req, res, next) => {
    try {
        const id = req.params.id;
        const imageFile = req.file;
        let profilePicUrl, fileName;
        if (imageFile) {
            profilePicUrl = imageFile.path;
            fileName = imageFile.filename;
        }
        const data = {
            ...req.body, achievements: req.body.achievement,
            ...(profilePicUrl && { profilePic: profilePicUrl, fileName }),
        };
        res.status(200).json(await (0, alumniMeet_service_1.updateAlumniService)(id, data));
    }
    catch (error) {
        next(error);
    }
};
exports.updateAlumni = updateAlumni;
const deleteAlumni = async (req, res, next) => {
    try {
        const deletedAlumni = await (0, alumniMeet_service_1.deleteAlumniService)(req.params.id);
        await (0, cloudnaryDeletion_1.deleteFromCloudinary)(deletedAlumni.fileName);
        res.status(200).json({ success: true, message: "Alumni deleted successfully.", data: deletedAlumni });
    }
    catch (err) {
        console.log(err.message);
        next(err);
    }
};
exports.deleteAlumni = deleteAlumni;
const addNewAlumniMeet = async (req, res, next) => {
    try {
        const data = req.body;
        const parsedClassJoined = JSON.parse(data.classJoined);
        const parsedTime = new Date(data.date);
        const Files = req.files;
        const images = Files?.images?.map((file) => ({ image: file.path, imageId: file.filename })) || [];
        const video = Files?.video?.[0]?.path || "";
        const videoId = Files?.video?.[0]?.filename || "";
        const newData = {
            ...data, classJoined: parsedClassJoined, time: parsedTime,
            media: { images, videoLink: video, videoId },
        };
        const newAlumniMeet = await (0, alumniMeet_service_1.createNewAlumniMeetService)(newData);
        res.status(200).json({ success: true, message: "Alumni Meet added successfully", data: newAlumniMeet });
    }
    catch (err) {
        console.error(err.message);
        next(err);
    }
};
exports.addNewAlumniMeet = addNewAlumniMeet;
const getAllAlumniMeets = async (req, res, next) => {
    try {
        const alumniMeets = await (0, alumniMeet_service_1.getAllAlumniMeetsService)();
        res.status(200).json({ success: true, message: "All Alumni Meets", data: alumniMeets });
    }
    catch (err) {
        next(err);
    }
};
exports.getAllAlumniMeets = getAllAlumniMeets;
const updateAlumniMeet = async (req, res, next) => {
    try {
        const data = req.body;
        const parsedClassJoined = JSON.parse(data.classJoined);
        const id = req.params.id;
        const Files = req.files;
        const images = Files?.images?.map((file) => ({ image: file.path, imageId: file.filename })) || [];
        const video = Files?.video?.[0]?.path || "";
        const videoId = Files?.video?.[0]?.filename || "";
        const newData = { ...data, classJoined: parsedClassJoined };
        const talkVideo = video && { videoLink: video, videoId };
        const talkImages = images.length > 0 && images;
        const deleteImagesIds = req.body.deleteImagesIds || [];
        if (deleteImagesIds.length > 0)
            await (0, cloudnaryDeletion_1.deleteFromCloudinary)(deleteImagesIds);
        const updatedAlumniMeet = await (0, alumniMeet_service_1.updateAlumniMeetService)(id, newData, talkImages, talkVideo, req.body.deleteImages || []);
        res.status(200).json({ success: true, message: "Alumni Meet updated successfully", data: updatedAlumniMeet });
    }
    catch (err) {
        console.log(err.message);
        next(err);
    }
};
exports.updateAlumniMeet = updateAlumniMeet;
const updateMeetMedia = async (req, res, next) => {
    try {
        const id = req.params.id;
        const Files = req.files;
        const images = Files?.images?.map((file) => ({ image: file.path, imageId: file.filename })) || [];
        const video = Files?.video?.[0]?.path || "";
        const videoId = Files?.video?.[0]?.filename || "";
        const updatedMeet = await (0, alumniMeet_service_1.updateMeetMediaService)(images, video, videoId, id);
        res.status(200).json({ success: true, message: "Alumni Meet updated successfully", data: updatedMeet });
    }
    catch (err) {
        console.log(err.message);
        next(err);
    }
};
exports.updateMeetMedia = updateMeetMedia;
const deleteMeetMedia = async (req, res, next) => {
    try {
        const imageIds = JSON.parse(req.body.imageIds);
        if (imageIds.length > 0)
            await (0, cloudnaryDeletion_1.deleteFromCloudinary)(imageIds);
        const updatedMeet = await (0, alumniMeet_service_1.deleteMeetMediaService)(imageIds, req.params.id);
        res.status(200).json({ success: true, message: "Alumni Meet updated successfully", data: updatedMeet });
    }
    catch (err) {
        console.log(err.message);
        next(err);
    }
};
exports.deleteMeetMedia = deleteMeetMedia;
const deleteAlumniMeet = async (req, res, next) => {
    try {
        const deletedAlumniMeet = await (0, alumniMeet_service_1.deleteAlumniMeetService)(req.params.id);
        const imagesIds = deletedAlumniMeet?.media?.images.map((image) => image.imageId);
        const videoId = deletedAlumniMeet?.media?.videoId;
        if (imagesIds)
            await (0, cloudnaryDeletion_1.deleteFromCloudinary)(imagesIds);
        if (videoId)
            await (0, cloudnaryDeletion_1.deleteFromCloudinary)([videoId], 'video');
        res.status(200).json({ success: true, message: "Alumni Meet deleted successfully" });
    }
    catch (err) {
        console.log(err.message);
        next(err);
    }
};
exports.deleteAlumniMeet = deleteAlumniMeet;
const getMeetsOnFrontend = async (req, res, next) => {
    try {
        const meets = await (0, alumniMeet_dao_1.getMeetsOnFrontendDao)(req.params.type);
        res.status(200).json(meets);
    }
    catch (err) {
        console.log(err.message);
        next(err);
    }
};
exports.getMeetsOnFrontend = getMeetsOnFrontend;
const getSomeRandomAlumni = async (req, res, next) => {
    try {
        res.status(200).json(await (0, alumniMeet_dao_1.getRandomAlumniDao)(4));
    }
    catch (err) {
        next(err);
    }
};
exports.getSomeRandomAlumni = getSomeRandomAlumni;
const addNewFeedback = async (req, res, next) => {
    try {
        const { comment, name, company } = req.body;
        const newFeedback = await (0, alumniMeet_service_1.addNewFeedbackService)(name, company, comment);
        if (newFeedback)
            res.status(200).json({ status: "succes", feeback: newFeedback });
    }
    catch (err) {
        console.log(err.message);
        next(err);
    }
};
exports.addNewFeedback = addNewFeedback;
const fetchRandomFeedbacks = async (req, res, next) => {
    try {
        const feedbacks = await (0, alumniMeet_dao_1.getRandomFeedbacksDao)(3);
        res.status(200).json({ status: "success", feedbacks });
    }
    catch (err) {
        console.error("Error fetching feedbacks:", err.message);
        next(err);
    }
};
exports.fetchRandomFeedbacks = fetchRandomFeedbacks;
const getTalksPagination = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 3;
        const data = await (0, alumniMeet_service_1.getTalksPaginationService)(page, limit);
        return res.status(200).json({ status: "success", ...data });
    }
    catch (err) {
        next(err);
    }
};
exports.getTalksPagination = getTalksPagination;
const feedbackPagination = async (req, res, next) => {
    try {
        const { page, limit } = req.query;
        const data = await (0, alumniMeet_service_1.feedbackPaginationService)(Number(page), Number(limit));
        return res.status(200).json({ status: "success", ...data });
    }
    catch (err) {
        next(err);
    }
};
exports.feedbackPagination = feedbackPagination;

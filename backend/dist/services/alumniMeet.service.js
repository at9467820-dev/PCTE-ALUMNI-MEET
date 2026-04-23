"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.feedbackPaginationService = exports.getTalksPaginationService = exports.addNewFeedbackService = exports.deleteAlumniMeetService = exports.deleteMeetMediaService = exports.updateMeetMediaService = exports.updateAlumniMeetService = exports.getAllAlumniMeetsService = exports.updateAlumniService = exports.deleteAlumniService = exports.createNewAlumniMeetService = exports.addNewAlumniService = exports.getAllAlumniListService = void 0;
const alumniMeet_dao_1 = require("../dao/alumniMeet.dao");
const customErrors_1 = require("../utility/customErrors");
const cloudnaryDeletion_1 = require("../utility/cloudnaryDeletion");
const getAllAlumniListService = async () => {
    return await (0, alumniMeet_dao_1.getAllAlumniDao)();
};
exports.getAllAlumniListService = getAllAlumniListService;
const addNewAlumniService = async (data) => {
    const requiredFields = {
        name: "Please enter your full name",
        batch: "Please enter your batch",
        email: "Please enter your email address",
        currentCompany: "Please enter your current company",
        currentRole: "Please enter your current role",
        achievement: "Please enter at least one achievement",
    };
    for (const field of Object.keys(requiredFields)) {
        if (!data[field])
            throw new customErrors_1.ValidationError(requiredFields[field]);
    }
    if (!data.profilePic || data.profilePic === 'null')
        throw new customErrors_1.ValidationError("Please upload a profile picture");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email))
        throw new customErrors_1.ValidationError("Please enter a valid email address");
    if (data.linkedIn && !/^https:\/\/(www\.)?linkedin\.com\/.*$/.test(data.linkedIn))
        throw new customErrors_1.ValidationError("Please enter a valid LinkedIn profile link");
    if (!Array.isArray(data.careerTimeline) || data.careerTimeline.length === 0)
        throw new customErrors_1.ValidationError("Please add at least one career timeline entry");
    for (const step of data.careerTimeline) {
        if (!step.year || !step.role || !step.company || !step.location)
            throw new customErrors_1.ValidationError("Each career step must include year, role, company, and location");
    }
    try {
        return await (0, alumniMeet_dao_1.addNewAlumniDao)(data);
    }
    catch (err) {
        if (err.message?.includes('Duplicate email'))
            throw new customErrors_1.ConflictError("This email is already registered. Try another one.");
        if (data.fileName)
            await (0, cloudnaryDeletion_1.deleteFromCloudinary)(data.fileName);
        throw err;
    }
};
exports.addNewAlumniService = addNewAlumniService;
const createNewAlumniMeetService = async (data) => {
    try {
        if (!data.title || typeof data.title !== "string" || data.title.trim().length < 3)
            throw new customErrors_1.ValidationError("Your event title looks too short. Please enter at least 3 characters.");
        if (!data.organizedBy || data.organizedBy.trim().length < 2)
            throw new customErrors_1.ValidationError("Please enter the organizer's name.");
        if (!data.location || data.location.trim().length < 2)
            throw new customErrors_1.ValidationError("Please add a venue for this talk.");
        if (!data.description)
            throw new customErrors_1.ValidationError("Please add a description for this talk.");
        if (data.description && data.description.length > 1000)
            throw new customErrors_1.ValidationError("The description is a bit too long. Keep it under 1000 characters.");
        if (!data.time || isNaN(new Date(data.time).getTime()))
            throw new customErrors_1.ValidationError("Please pick a valid date and time for the event.");
        if (!data.alumni || data.alumni === 'null')
            throw new customErrors_1.ValidationError("Select an alumni from the list before continuing.");
        if (data.classJoined && data.classJoined.some((cls) => !cls || typeof cls !== "string" || cls.trim().length < 2))
            throw new customErrors_1.ValidationError("One or more class names don't look right. Please check them.");
        if (data.media.videoLink && typeof data.media.videoLink !== "string")
            throw new customErrors_1.ValidationError("That doesn't look like a valid video link. Please check and try again.");
        data.title = data.title.trim();
        data.organizedBy = data.organizedBy.trim();
        data.location = data.location.trim();
        data.description = data.description?.trim();
        return await (0, alumniMeet_dao_1.createNewAlumniMeetDao)(data);
    }
    catch (e) {
        await Promise.all(data.media.images.map(async (image) => { await (0, cloudnaryDeletion_1.deleteFromCloudinary)(image.imageId); }));
        if (data.media.videoId)
            await (0, cloudnaryDeletion_1.deleteFromCloudinary)(data.media.videoId);
        throw e;
    }
};
exports.createNewAlumniMeetService = createNewAlumniMeetService;
const deleteAlumniService = async (id) => {
    const isAlumniExist = await (0, alumniMeet_dao_1.checkAlumniByIdDao)(id);
    if (!isAlumniExist)
        throw new customErrors_1.NotFoundError("Can't delete alumni. Alumni not exist");
    const isMeetsExist = await (0, alumniMeet_dao_1.checkAlumniMeetsDaoByAlumniId)(id);
    if (isMeetsExist)
        throw new customErrors_1.BadRequestError("Cannot delete alumni. Alumni is associated with a meet.");
    const deletedAlumni = await (0, alumniMeet_dao_1.deleteAlumniDao)(id);
    if (!deletedAlumni)
        throw new customErrors_1.NotFoundError("Deletion failed. Alumni may have already been deleted.");
    return deletedAlumni;
};
exports.deleteAlumniService = deleteAlumniService;
const updateAlumniService = async (id, data) => {
    const requiredFields = {
        name: "Please enter your full name", batch: "Please enter your batch",
        email: "Please enter your email address", currentCompany: "Please enter your current company",
        currentRole: "Please enter your current role", achievement: "Please enter at least one achievement",
    };
    for (const field of Object.keys(requiredFields)) {
        if (!data[field])
            throw new customErrors_1.ValidationError(requiredFields[field]);
    }
    if (!id)
        throw new customErrors_1.NotFoundError("Invalid alumni ID");
    let parsedCareerTimeline, parsedAchievements;
    try {
        parsedCareerTimeline = JSON.parse(data.careerTimeline);
        parsedAchievements = JSON.parse(data.achievements);
    }
    catch {
        throw new customErrors_1.ValidationError("Invalid JSON format for career timeline or achievements");
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email))
        throw new customErrors_1.ValidationError("Please enter a valid email address");
    if (data.linkedIn && !/^https:\/\/(www\.)?linkedin\.com\/.*$/.test(data.linkedIn))
        throw new customErrors_1.ValidationError("Please enter a valid LinkedIn profile link");
    if (!Array.isArray(parsedCareerTimeline) || parsedCareerTimeline.length === 0)
        throw new customErrors_1.ValidationError("Please add at least one career timeline entry");
    for (const step of parsedCareerTimeline) {
        if (!step.year || !step.role || !step.company || !step.location)
            throw new customErrors_1.ValidationError("Each career step must include year, role, company, and location");
    }
    const oldAlumni = await (0, alumniMeet_dao_1.findAlumniByIdDao)(id);
    if (!oldAlumni)
        throw new customErrors_1.NotFoundError("Cannot update alumni. Alumni not exist");
    if (data.profilePic && oldAlumni.fileName)
        await (0, cloudnaryDeletion_1.deleteFromCloudinary)(oldAlumni.fileName);
    return (await (0, alumniMeet_dao_1.updateAlumniDao)(id, { ...data, careerTimeline: parsedCareerTimeline, achievements: parsedAchievements }));
};
exports.updateAlumniService = updateAlumniService;
const getAllAlumniMeetsService = async () => {
    return await (0, alumniMeet_dao_1.getAllAlumniMeetsDao)();
};
exports.getAllAlumniMeetsService = getAllAlumniMeetsService;
const updateAlumniMeetService = async (id, data, talkImages, talkVideo, deleteImages) => {
    if (!data.title || typeof data.title !== "string" || data.title.trim().length < 3)
        throw new customErrors_1.ValidationError("Your event title looks too short.");
    if (!data.organizedBy || data.organizedBy.trim().length < 2)
        throw new customErrors_1.ValidationError("Please enter the organizer's name.");
    if (!data.location || data.location.trim().length < 2)
        throw new customErrors_1.ValidationError("Please add a venue for this talk.");
    if (!data.description)
        throw new customErrors_1.ValidationError("Please add a description for this talk.");
    if (data.description && data.description.length > 1000)
        throw new customErrors_1.ValidationError("Description too long. Keep it under 1000 characters.");
    if (!data.time || isNaN(new Date(data.time).getTime()))
        throw new customErrors_1.ValidationError("Please pick a valid date and time.");
    if (data.classJoined && data.classJoined.some((cls) => !cls || typeof cls !== "string" || cls.trim().length < 2))
        throw new customErrors_1.ValidationError("One or more class names don't look right.");
    data.title = data.title.trim();
    data.organizedBy = data.organizedBy.trim();
    data.location = data.location.trim();
    data.description = data.description?.trim();
    const isExist = await (0, alumniMeet_dao_1.checkAlumniMeetsDaoByid)(id);
    if (!isExist)
        throw new Error("Cannot update alumni meet. Alumni meet not exist");
    const updatedAlumniMeet = await (0, alumniMeet_dao_1.updateAlumniMeetDao)(id, data, talkImages, talkVideo, deleteImages);
    if (!updatedAlumniMeet)
        throw new Error("Updation failed!");
    return updatedAlumniMeet;
};
exports.updateAlumniMeetService = updateAlumniMeetService;
const updateMeetMediaService = async (images, video, videoId, id) => {
    try {
        return await (0, alumniMeet_dao_1.updateMeetMediaDao)(images, video, videoId, id);
    }
    catch (err) {
        await Promise.all(images.map(async (image) => { await (0, cloudnaryDeletion_1.deleteFromCloudinary)(image.imageId); }));
        if (videoId)
            await (0, cloudnaryDeletion_1.deleteFromCloudinary)(videoId);
        throw err;
    }
};
exports.updateMeetMediaService = updateMeetMediaService;
const deleteMeetMediaService = async (imageIds, id) => {
    if (imageIds.length === 0)
        return;
    const isExist = await (0, alumniMeet_dao_1.checkAlumniMeetsDaoByid)(id);
    if (!isExist)
        throw new Error("Cannot delete media. Meet not exist");
    const updatedMeet = await (0, alumniMeet_dao_1.deleteMeetMediaDao)(imageIds, id);
    if (!updatedMeet)
        throw new Error("Deletion failed!.");
    return updatedMeet;
};
exports.deleteMeetMediaService = deleteMeetMediaService;
const deleteAlumniMeetService = async (id) => {
    const isExist = await (0, alumniMeet_dao_1.checkAlumniMeetsDaoByid)(id);
    if (!isExist)
        throw new Error("Cannot delete alumni meet. Alumni meet not exist");
    const deletedAlumniMeet = await (0, alumniMeet_dao_1.deleteAlumniMeetDao)(id);
    if (!deletedAlumniMeet)
        throw new Error("Deletion failed.");
    return deletedAlumniMeet;
};
exports.deleteAlumniMeetService = deleteAlumniMeetService;
const addNewFeedbackService = async (name, company, comment) => {
    if (!name || name.trim().length === 0)
        throw new Error("Name is required");
    if (!company || company.trim().length === 0)
        throw new Error("Company is required");
    if (!comment || comment.trim().length === 0)
        throw new Error("Comment is required");
    if (comment.length > 500)
        throw new Error("Comment cannot exceed 500 characters");
    return await (0, alumniMeet_dao_1.addFeedbackDao)(name, company, comment);
};
exports.addNewFeedbackService = addNewFeedbackService;
const getTalksPaginationService = async (page = 1, limit = 3) => {
    const now = new Date();
    const { talks, total } = await (0, alumniMeet_dao_1.getTalksPaginationDao)(page, limit, now);
    const totalPages = Math.ceil(total / limit);
    return { talks, total, page, totalPages, hasMore: page < totalPages };
};
exports.getTalksPaginationService = getTalksPaginationService;
const feedbackPaginationService = async (page = 1, limit = 10) => {
    const { feedbacks, total } = await (0, alumniMeet_dao_1.feedbackPaginationDao)(page, limit);
    const totalPages = Math.ceil(total / limit);
    return { feedbacks, totalPages, page, hasMore: page < totalPages };
};
exports.feedbackPaginationService = feedbackPaginationService;

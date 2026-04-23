import { addNewAlumniService, addNewFeedbackService, createNewAlumniMeetService, deleteAlumniMeetService, deleteAlumniService, deleteMeetMediaService, feedbackPaginationService, getAllAlumniListService, getAllAlumniMeetsService, getTalksPaginationService, updateAlumniMeetService, updateAlumniService, updateMeetMediaService, } from "../services/alumniMeet.service";
import { deleteFromCloudinary } from "../utility/cloudnaryDeletion";
import { getMeetsOnFrontendDao, getRandomAlumniDao, getRandomFeedbacksDao } from "../dao/alumniMeet.dao";
export const getAllAlumni = async (req, res, next) => {
    try {
        res.status(200).json(await getAllAlumniListService());
    }
    catch (err) {
        next(err);
    }
};
export const addNewAlumni = async (req, res, next) => {
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
        const newAlumni = await addNewAlumniService(alumniInput);
        return res.status(200).json({ success: true, message: "Alumni added successfully", data: newAlumni });
    }
    catch (err) {
        next(err);
    }
};
export const updateAlumni = async (req, res, next) => {
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
        res.status(200).json(await updateAlumniService(id, data));
    }
    catch (error) {
        next(error);
    }
};
export const deleteAlumni = async (req, res, next) => {
    try {
        const deletedAlumni = await deleteAlumniService(req.params.id);
        await deleteFromCloudinary(deletedAlumni.fileName);
        res.status(200).json({ success: true, message: "Alumni deleted successfully.", data: deletedAlumni });
    }
    catch (err) {
        console.log(err.message);
        next(err);
    }
};
export const addNewAlumniMeet = async (req, res, next) => {
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
        const newAlumniMeet = await createNewAlumniMeetService(newData);
        res.status(200).json({ success: true, message: "Alumni Meet added successfully", data: newAlumniMeet });
    }
    catch (err) {
        console.error(err.message);
        next(err);
    }
};
export const getAllAlumniMeets = async (req, res, next) => {
    try {
        const alumniMeets = await getAllAlumniMeetsService();
        res.status(200).json({ success: true, message: "All Alumni Meets", data: alumniMeets });
    }
    catch (err) {
        next(err);
    }
};
export const updateAlumniMeet = async (req, res, next) => {
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
            await deleteFromCloudinary(deleteImagesIds);
        const updatedAlumniMeet = await updateAlumniMeetService(id, newData, talkImages, talkVideo, req.body.deleteImages || []);
        res.status(200).json({ success: true, message: "Alumni Meet updated successfully", data: updatedAlumniMeet });
    }
    catch (err) {
        console.log(err.message);
        next(err);
    }
};
export const updateMeetMedia = async (req, res, next) => {
    try {
        const id = req.params.id;
        const Files = req.files;
        const images = Files?.images?.map((file) => ({ image: file.path, imageId: file.filename })) || [];
        const video = Files?.video?.[0]?.path || "";
        const videoId = Files?.video?.[0]?.filename || "";
        const updatedMeet = await updateMeetMediaService(images, video, videoId, id);
        res.status(200).json({ success: true, message: "Alumni Meet updated successfully", data: updatedMeet });
    }
    catch (err) {
        console.log(err.message);
        next(err);
    }
};
export const deleteMeetMedia = async (req, res, next) => {
    try {
        const imageIds = JSON.parse(req.body.imageIds);
        if (imageIds.length > 0)
            await deleteFromCloudinary(imageIds);
        const updatedMeet = await deleteMeetMediaService(imageIds, req.params.id);
        res.status(200).json({ success: true, message: "Alumni Meet updated successfully", data: updatedMeet });
    }
    catch (err) {
        console.log(err.message);
        next(err);
    }
};
export const deleteAlumniMeet = async (req, res, next) => {
    try {
        const deletedAlumniMeet = await deleteAlumniMeetService(req.params.id);
        const imagesIds = deletedAlumniMeet?.media?.images.map((image) => image.imageId);
        const videoId = deletedAlumniMeet?.media?.videoId;
        if (imagesIds)
            await deleteFromCloudinary(imagesIds);
        if (videoId)
            await deleteFromCloudinary([videoId], 'video');
        res.status(200).json({ success: true, message: "Alumni Meet deleted successfully" });
    }
    catch (err) {
        console.log(err.message);
        next(err);
    }
};
export const getMeetsOnFrontend = async (req, res, next) => {
    try {
        const meets = await getMeetsOnFrontendDao(req.params.type);
        res.status(200).json(meets);
    }
    catch (err) {
        console.log(err.message);
        next(err);
    }
};
export const getSomeRandomAlumni = async (req, res, next) => {
    try {
        res.status(200).json(await getRandomAlumniDao(4));
    }
    catch (err) {
        next(err);
    }
};
export const addNewFeedback = async (req, res, next) => {
    try {
        const { comment, name, company } = req.body;
        const newFeedback = await addNewFeedbackService(name, company, comment);
        if (newFeedback)
            res.status(200).json({ status: "succes", feeback: newFeedback });
    }
    catch (err) {
        console.log(err.message);
        next(err);
    }
};
export const fetchRandomFeedbacks = async (req, res, next) => {
    try {
        const feedbacks = await getRandomFeedbacksDao(3);
        res.status(200).json({ status: "success", feedbacks });
    }
    catch (err) {
        console.error("Error fetching feedbacks:", err.message);
        next(err);
    }
};
export const getTalksPagination = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 3;
        const data = await getTalksPaginationService(page, limit);
        return res.status(200).json({ status: "success", ...data });
    }
    catch (err) {
        next(err);
    }
};
export const feedbackPagination = async (req, res, next) => {
    try {
        const { page, limit } = req.query;
        const data = await feedbackPaginationService(Number(page), Number(limit));
        return res.status(200).json({ status: "success", ...data });
    }
    catch (err) {
        next(err);
    }
};

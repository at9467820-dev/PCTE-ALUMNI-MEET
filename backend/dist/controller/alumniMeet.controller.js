import { addNewAlumniService, addNewFeedbackService, createNewAlumniMeetService, deleteAlumniMeetService, deleteAlumniService, deleteMeetMediaService, feedbackPaginationService, getAllAlumniListService, getAllAlumniMeetsService, getTalksPaginationService, updateAlumniMeetService, updateAlumniService, updateMeetMediaService, } from "../services/alumniMeet.service";
import { deleteFromCloudinary } from "../utility/cloudnaryDeletion";
import alumniMeetModel from "../model/alumniMeet.model";
import alumniModel from "../model/alumni.model";
import feebackModel from "../model/feedback.model";
export const getAllAlumni = async (req, res, next) => {
    try {
        const alumniList = await getAllAlumniListService();
        res.status(200).json(alumniList);
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
        let profilePicUrl;
        let fileName;
        if (file) {
            // // ✅ remove bg and upload to cloudinary
            // profilePicUrl = await removeBackground(file.filename);
            profilePicUrl = file.path;
            fileName = file.filename;
        }
        const alumniInput = {
            ...data,
            careerTimeline: parsedCareerTimeline,
            achievements: parsedAchievements,
            ...(profilePicUrl && {
                profilePic: profilePicUrl,
                fileName,
            }),
        };
        const newAlumni = await addNewAlumniService(alumniInput);
        return res.status(200).json({
            success: true,
            message: "Alumni added successfully",
            data: newAlumni,
        });
    }
    catch (err) {
        next(err);
    }
};
export const updateAlumni = async (req, res, next) => {
    try {
        const id = req.params.id;
        const imageFile = req.file;
        let profilePicUrl;
        let fileName;
        if (imageFile) {
            // ✅ remove bg and upload to cloudinary
            // profilePicUrl = await removeBackground(imageFile.filename);
            profilePicUrl = imageFile.path;
            fileName = imageFile.filename;
        }
        const data = {
            ...req.body,
            achievements: req.body.achievement,
            ...(profilePicUrl && {
                profilePic: profilePicUrl,
                fileName,
            }),
        };
        const updatedAlumni = await updateAlumniService(id, data);
        res.status(200).json(updatedAlumni);
    }
    catch (error) {
        next(error);
    }
};
export const deleteAlumni = async (req, res, next) => {
    try {
        const id = req.params.id;
        const deletedAlumni = await deleteAlumniService(id);
        const fileName = deletedAlumni.fileName;
        await deleteFromCloudinary(fileName);
        res.status(200).json({
            success: true,
            message: "Alumni deleted successfully.",
            data: deletedAlumni,
        });
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
        console.log(parsedClassJoined);
        const parsedTime = new Date(data.date);
        const Files = req.files;
        // const images: string[] = Files?.images?.map((file) => file.path) || [];
        // const imagesIds: string[] = Files?.images?.map((file) => file.filename) || [];
        const images = Files?.images?.map((file) => ({
            image: file.path,
            imageId: file.filename,
        })) || [];
        const video = Files?.video?.[0]?.path || "";
        const videoId = Files?.video?.[0]?.filename || "";
        const newData = {
            ...data,
            classJoined: parsedClassJoined,
            time: parsedTime,
            media: {
                images,
                videoLink: video,
                videoId: videoId,
            },
        };
        console.log(newData);
        const newAlumniMeet = await createNewAlumniMeetService(newData);
        res.status(200).json({
            success: true,
            message: "Alumni Meet added successfully",
            data: newAlumniMeet,
        });
    }
    catch (err) {
        console.error(err.message);
        next(err);
    }
};
export const getAllAlumniMeets = async (req, res, next) => {
    try {
        const alumniMeets = await getAllAlumniMeetsService();
        res
            .status(200)
            .json({ success: true, message: "All Alumni Meets", data: alumniMeets });
    }
    catch (err) {
        next(err);
    }
};
export const updateAlumniMeet = async (req, res, next) => {
    try {
        const data = req.body;
        console.log(data.images);
        const parsedClassJoined = JSON.parse(data.classJoined);
        console.log("printing data");
        console.dir(data);
        const id = req.params.id;
        const Files = req.files;
        const images = Files?.images?.map((file) => ({
            image: file.path,
            imageId: file.filename,
        })) || [];
        console.log(images);
        const video = Files?.video?.[0]?.path || "";
        const videoId = Files?.video?.[0]?.filename || "";
        const newData = {
            ...data,
            classJoined: parsedClassJoined,
        };
        const talkVideo = video && { videoLink: video, videoId };
        console.log('videos : ', talkVideo);
        const talkImages = images.length > 0 && images;
        console.log('images : ', talkImages);
        console.dir(data);
        const deleteImagesUrls = req.body.deleteImages || [];
        const deleteImagesIds = req.body.deleteImagesIds || [];
        if (deleteImagesIds.length > 0) {
            await deleteFromCloudinary(deleteImagesIds);
        }
        const updatedAlumniMeet = await updateAlumniMeetService(id, newData, talkImages, talkVideo, deleteImagesUrls);
        res.status(200).json({
            success: true,
            message: "Alumni Meet updated successfully",
            data: updatedAlumniMeet,
        });
    }
    catch (err) {
        console.log(err.message);
        next(err);
    }
};
export const updateMeetMedia = async (req, res, next) => {
    try {
        const id = req.params.id;
        console.log("chala");
        const Files = req.files;
        const images = Files?.images?.map((file) => ({
            image: file.path,
            imageId: file.filename,
        })) || [];
        const video = Files?.video?.[0]?.path || "";
        const videoId = Files?.video?.[0]?.filename || "";
        const updatedMeet = await updateMeetMediaService(images, video, videoId, id);
        res.status(200).json({
            success: true,
            message: "Alumni Meet updated successfully",
            data: updatedMeet,
        });
    }
    catch (err) {
        console.log(err.message);
        next(err);
    }
};
export const deleteMeetMedia = async (req, res, next) => {
    const id = req.params.id;
    try {
        const imageIds = JSON.parse(req.body.imageIds);
        if (imageIds.length > 0) {
            await deleteFromCloudinary(imageIds);
        }
        const updatedMeet = await deleteMeetMediaService(imageIds, id);
        res.status(200).json({
            success: true,
            message: "Alumni Meet updated successfully",
            data: updatedMeet,
        });
    }
    catch (err) {
        console.log(err.message);
        next(err);
    }
};
export const deleteAlumniMeet = async (req, res, next) => {
    try {
        const id = req.params.id;
        console.log(id);
        const deletedAlumniMeet = await deleteAlumniMeetService(id);
        const imagesIds = deletedAlumniMeet?.media?.images.map((image) => image.imageId);
        const videoId = deletedAlumniMeet?.media?.videoId;
        if (imagesIds) {
            await deleteFromCloudinary(imagesIds);
        }
        if (videoId) {
            console.log(videoId);
            await deleteFromCloudinary([videoId], 'video');
        }
        res.status(200).json({
            success: true,
            message: "Alumni Meet deleted successfully",
        });
    }
    catch (err) {
        console.log(err.message);
        next(err);
    }
};
export const getMeetsOnFrontend = async (req, res, next) => {
    try {
        const params = req.params.type;
        const now = new Date();
        let meets;
        if (params === 'randomUpcomings') {
            meets = await alumniMeetModel.aggregate([
                { $match: { time: { $gt: now } } },
                { $sample: { size: 1 } }
            ]);
        }
        if (params === 'allUpcomings') {
            console.log("chaala");
            meets = await alumniMeetModel.aggregate([
                { $match: { time: { $gt: now } } },
            ]);
        }
        if (params === 'randomPast') {
            meets = await alumniMeetModel.aggregate([
                { $match: { time: { $lt: now } } },
                { $sample: { size: 3 } }
            ]);
        }
        if (params === 'allPast') {
            meets = await alumniMeetModel.aggregate([{ $match: { time: { $lt: now } } }]);
        }
        const populatedDoc = await alumniMeetModel.populate(meets, {
            path: "alumni",
        });
        res.status(200).json(populatedDoc);
    }
    catch (err) {
        console.log(err.message);
        next(err);
    }
};
export const getSomeRandomAlumni = async (req, res, next) => {
    try {
        const alumnis = await alumniModel.aggregate([
            { $sample: { size: 4 } }
        ]);
        res.status(200).json(alumnis);
    }
    catch (err) {
        console.log(err.message);
        next(err);
    }
};
export const addNewFeedback = async (req, res, next) => {
    console.log(req.body);
    const { comment, name, company } = req.body;
    try {
        const newFeedback = await addNewFeedbackService(name, company, comment);
        if (newFeedback) {
            res.status(200).json({ status: "succes", feeback: newFeedback });
        }
    }
    catch (err) {
        console.log(err.message);
        next(err);
    }
};
export const fetchRandomFeedbacks = async (req, res, next) => {
    try {
        const feedbacks = await feebackModel.aggregate([
            { $sample: { size: 3 } }
        ]);
        res.status(200).json({
            status: "success",
            feedbacks
        });
    }
    catch (err) {
        console.error("Error fetching feedbacks:", err.message);
        next(err);
    }
};
export const getTalksPagination = async (req, res, next) => {
    try {
        console.log("chala");
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 3;
        const data = await getTalksPaginationService(page, limit);
        console.log(data);
        return res.status(200).json({ status: "success", ...data });
    }
    catch (err) {
        console.log("Error fetching talks : ", err);
        next(err);
    }
};
export const feedbackPagination = async (req, res, next) => {
    try {
        console.log("aaya");
        const { page, limit } = req.query;
        const data = await feedbackPaginationService(Number(page), Number(limit));
        return res.status(200).json({ status: "success", ...data });
    }
    catch (err) {
        console.log("Error fetching feedbacks : ", err);
        next(err);
    }
};

import mongoose from "mongoose";
import alumniModel from "../model/alumni.model";
import alumniMeetModel from "../model/alumniMeet.model";
import { deleteFromCloudinary } from "../utility/cloudnaryDeletion";
import feedbackModel from "../model/feedback.model";
// good
export const getAllAlumniDao = async () => {
    try {
        const allAlumnis = await alumniModel.find().sort({ createdAt: -1 });
        return allAlumnis;
    }
    catch (err) {
        throw new Error("SomeThing went Wrong while Fetching all Alumnis");
    }
};
// production ready done
export const getAlumniById = async (id) => {
    try {
        const alumni = await alumniModel.findById(id);
        if (!alumni) {
            throw new Error("Alumni not found");
        }
        return alumni;
    }
    catch (err) {
        console.error("DAO Error [getAlumniById]:", err);
        throw new Error(`Failed to fetch Alumni by ID: ${err.message}`);
    }
};
// production ready done
export const addNewAlumniDao = async (data) => {
    try {
        const newAlumni = new alumniModel(data);
        await newAlumni.save();
        return newAlumni;
    }
    catch (err) {
        if (err.code === 11000 && err.keyValue?.email) {
            throw new Error(`Duplicate email found: ${err.keyValue.email}`);
        }
        if (err instanceof mongoose.Error.ValidationError) {
            throw new Error(`Validation Error: ${err.message}`);
        }
        throw err;
    }
};
// production ready done
export const createNewAlumniMeetDao = async (data) => {
    try {
        const newAlumniMeet = new alumniMeetModel(data);
        await newAlumniMeet.save();
        return newAlumniMeet;
    }
    catch (err) {
        console.error("DAO Error [createNewAlumniMeet]:", err);
        if (err instanceof mongoose.Error.ValidationError) {
            throw new Error(`Validation Error: ${err.message}`);
        }
        throw new Error("Failed to create Alumni Meet. Please try again later.");
    }
};
// Production ready done
export const checkAlumniByIdDao = async (id) => {
    try {
        const alumni = await alumniModel.exists({ _id: id });
        return Boolean(alumni);
    }
    catch (err) {
        console.error("DAO Error [checkAlumniById]:", err);
        throw new Error(`Failed to check Alumni by ID: ${err.message}`);
    }
};
// Production ready done
export const checkAlumniMeetsDaoByAlumniId = async (id) => {
    try {
        const alumniMeets = await alumniMeetModel.exists({ alumni: id });
        return Boolean(alumniMeets);
    }
    catch (err) {
        console.error("DAO Error [checkAlumniMeets]:", err);
        throw new Error(`Failed to check Alumni Meets by Alumni ID: ${err.message}`);
    }
};
export const checkAlumniMeetsDaoByid = async (id) => {
    try {
        const alumniMeets = await alumniMeetModel.exists({ _id: id });
        return Boolean(alumniMeets);
    }
    catch (err) {
        console.error("DAO Error [checkAlumniMeets]:", err);
        throw new Error(`Failed to check Alumni Meets by Alumni ID: ${err.message}`);
    }
};
//Production ready done
export const deleteAlumniDao = async (id) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error("Invalid Alumni ID format");
        }
        const deletedAlumni = await alumniModel.findByIdAndDelete(id);
        if (!deletedAlumni) {
            throw new Error("Alumni not found");
        }
        return deletedAlumni;
    }
    catch (err) {
        console.error("DAO Error [deleteAlumni]:", err);
        if (err instanceof mongoose.Error.CastError) {
            throw new Error("Invalid Alumni ID format");
        }
        throw new Error(`Failed to delete Alumni : ${err.message}`);
    }
};
//production ready done
export const findAlumniByIdDao = async (id) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error("Invalid Alumni ID format");
        }
        return await alumniModel.findById(id);
    }
    catch (err) {
        console.log("DAO Error [findAlumniById] : ", err);
        if (err instanceof mongoose.Error.CastError) {
            throw new Error("Invalid Alumni ID format");
        }
        throw new Error(`Failed to find Alumni using Id : ${err.message}`);
    }
};
//production ready done
export const updateAlumniDao = async (id, data) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error("Invalid Alumni Id format");
        }
        const updatedAlumni = await alumniModel.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true,
        });
        return updatedAlumni;
    }
    catch (err) {
        console.error("DAO Error [updateAlumni] : ", err);
        if (err instanceof mongoose.Error.CastError) {
            throw new Error("validation Error : " + err.message);
        }
        throw new Error(`Can't update alumniData : ${err.message}`);
    }
};
//Production ready done
export const getAllAlumniMeetsDao = async () => {
    try {
        const alumniMeets = await alumniMeetModel.find().sort({ createdAt: -1 }).populate("alumni");
        if (!alumniMeets || alumniMeets.length === 0) {
            throw new Error("Alumni Meets not found");
        }
        return alumniMeets;
    }
    catch (err) {
        console.error("DAO Error [getAllMeets] : ", err.message);
        throw new Error(`Failed to fetch Meet : ${err.message}`);
    }
};
export const updateAlumniMeetDao = async (id, data, talkImages, talkVideo, deleteImages) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error("Invalid Meet Id format");
        }
        const alumniMeet = await alumniMeetModel.findById(id);
        if (!alumniMeet) {
            throw new Error("Alumni Meet not found");
        }
        console.log(data);
        Object.assign(alumniMeet, data);
        if (talkImages) {
            alumniMeet.media.images.push(...talkImages);
        }
        if (talkVideo) {
            console.log(talkVideo.videoLink);
            alumniMeet.media.videoLink = talkVideo.videoLink;
            alumniMeet.media.videoId = talkVideo.videoId;
        }
        if (deleteImages.length > 0) {
            alumniMeet.media.images = alumniMeet.media.images.filter((img) => !deleteImages.includes(img.imageId));
        }
        await alumniMeet.save();
        return alumniMeet;
    }
    catch (err) {
        if (err instanceof mongoose.Error.CastError) {
            throw new Error("Invalid AlumniMeet ID format");
        }
        if (err instanceof mongoose.Error.ValidationError) {
            throw new Error(`Validation Error: ${err.message}`);
        }
        throw new Error(`Database error while updating Alumni Meet: ${err.message}`);
    }
};
export const updateMeetMediaDao = async (images, video, videoId, id) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error("Invalid Meet Id format");
        }
        const meet = await alumniMeetModel.findById(id);
        if (!meet) {
            throw new Error("Alumni Meet not found");
        }
        if (images && images.length > 0) {
            images.forEach((img) => {
                meet?.media.images.push(img);
            });
        }
        if (video) {
            if (meet.media.videoId) {
                console.log(meet.media.videoId);
                await deleteFromCloudinary(meet.media.videoId, "video");
            }
            meet.media.videoLink = video;
            meet.media.videoId = videoId;
        }
        await meet.save();
        return meet;
    }
    catch (err) {
        if (err instanceof mongoose.Error.CastError) {
            throw new Error("Invalid Neet ID format");
        }
        if (err instanceof mongoose.Error.ValidationError) {
            throw new Error(`Validation Error: ${err.message}`);
        }
        throw new Error(`Database error while updating Alumni Meet Media: ${err.message}`);
    }
};
export const deleteMeetMediaDao = async (imageIds, id) => {
    try {
        if (mongoose.Types.ObjectId.isValid(id)) {
            throw new Error("Invalid Meet Id format");
        }
        const meet = await alumniMeetModel.findById(id);
        if (!meet) {
            throw new Error("Alumni Meet not found");
        }
        if (imageIds && imageIds.length > 0) {
            await deleteFromCloudinary(imageIds);
        }
    }
    catch (err) {
        throw new Error(`Database error while deleting Alumni Meet Media: ${err.message}`);
    }
};
export const deleteAlumniMeetDao = async (id) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error("Invalid Alumni Meet ID format");
        }
        const deletedAlumniMeet = await alumniMeetModel.findByIdAndDelete(id);
        if (!deletedAlumniMeet) {
            throw new Error("Deletion failed. Alumni Meet may have already been deleted.");
        }
        return deletedAlumniMeet;
    }
    catch (err) {
        if (err instanceof mongoose.Error.CastError) {
            throw new Error("Invalid Alumni Meet ID format");
        }
        throw new Error("Database error while deleting Alumni Meet: " + err.message);
    }
};
export const addFeedbackDao = async (name, company, comment) => {
    try {
        const feedbackDoc = new feedbackModel({ name, company, comment });
        await feedbackDoc.save();
        return feedbackDoc;
    }
    catch (err) {
        throw new Error("Database error while adding new Feedback: " + err.message);
    }
};
export const getTalksPaginationDao = async (page, limit, now) => {
    try {
        const skip = (page - 1) * limit;
        const talks = await alumniMeetModel.find({ time: { $lte: now } }).sort({ createdAt: -1 }).skip(skip).limit(limit).lean().populate({ path: "alumni" });
        const total = await alumniMeetModel.countDocuments({ time: { $lte: now } });
        return { talks, total };
    }
    catch (err) {
        throw new Error("Database error while fetching talks on frontend: " + err.message);
    }
};
export const feedbackPaginationDao = async (page, limit) => {
    try {
        const skip = (page - 1) * limit;
        const feedbacks = await feedbackModel.find().sort({ createdAt: -1 }).skip(skip).limit(limit);
        console.log(feedbacks);
        const total = await feedbackModel.countDocuments();
        return { feedbacks, total };
    }
    catch (err) {
        throw new Error("Database error while fetching feedbacks on frontend: " + err.message);
    }
};

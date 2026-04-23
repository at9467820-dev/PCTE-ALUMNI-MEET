import { Request, Response, NextFunction } from "express";
import {
  addNewAlumniService, addNewFeedbackService, createNewAlumniMeetService,
  deleteAlumniMeetService, deleteAlumniService, deleteMeetMediaService,
  feedbackPaginationService, getAllAlumniListService, getAllAlumniMeetsService,
  getTalksPaginationService, updateAlumniMeetService, updateAlumniService, updateMeetMediaService,
} from "../services/alumniMeet.service";
import { AlumniInput, AlumniMeetInput } from "../types/interface";
import { deleteFromCloudinary } from "../utility/cloudnaryDeletion";
import { getMeetsOnFrontendDao, getRandomAlumniDao, getRandomFeedbacksDao } from "../dao/alumniMeet.dao";

export const getAllAlumni = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try { res.status(200).json(await getAllAlumniListService()); } catch (err) { next(err); }
};

export const addNewAlumni = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = req.body;
    const file = req.file as Express.Multer.File & { path: string; filename: string };
    const parsedCareerTimeline = JSON.parse(data.careerTimeline);
    const parsedAchievements = JSON.parse(data.achievement);
    let profilePicUrl: string | undefined, fileName: string | undefined;
    if (file) { profilePicUrl = file.path; fileName = file.filename; }
    const alumniInput: AlumniInput = {
      ...data, careerTimeline: parsedCareerTimeline, achievements: parsedAchievements,
      ...(profilePicUrl && { profilePic: profilePicUrl, fileName }),
    };
    const newAlumni = await addNewAlumniService(alumniInput);
    return res.status(200).json({ success: true, message: "Alumni added successfully", data: newAlumni });
  } catch (err) { next(err); }
};

export const updateAlumni = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const imageFile = req.file as Express.Multer.File & { path: string; filename: string };
    let profilePicUrl: string | undefined, fileName: string | undefined;
    if (imageFile) { profilePicUrl = imageFile.path; fileName = imageFile.filename; }
    const data: AlumniInput = {
      ...req.body, achievements: req.body.achievement,
      ...(profilePicUrl && { profilePic: profilePicUrl, fileName }),
    };
    res.status(200).json(await updateAlumniService(id, data));
  } catch (error) { next(error); }
};

export const deleteAlumni = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const deletedAlumni = await deleteAlumniService(req.params.id);
    await deleteFromCloudinary(deletedAlumni.fileName as string);
    res.status(200).json({ success: true, message: "Alumni deleted successfully.", data: deletedAlumni });
  } catch (err: any) { console.log(err.message); next(err); }
};

export const addNewAlumniMeet = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = req.body;
    const parsedClassJoined = JSON.parse(data.classJoined);
    const parsedTime = new Date(data.date);
    const Files = req.files as { images?: (Express.Multer.File & { path: string; filename: string })[]; video?: (Express.Multer.File & { path: string; filename: string })[] };
    const images = Files?.images?.map((file) => ({ image: file.path, imageId: file.filename })) || [];
    const video: string = Files?.video?.[0]?.path || "";
    const videoId: string = Files?.video?.[0]?.filename || "";
    const newData: AlumniMeetInput = {
      ...data, classJoined: parsedClassJoined, time: parsedTime,
      media: { images, videoLink: video, videoId },
    };
    const newAlumniMeet = await createNewAlumniMeetService(newData);
    res.status(200).json({ success: true, message: "Alumni Meet added successfully", data: newAlumniMeet });
  } catch (err: any) { console.error(err.message); next(err); }
};

export const getAllAlumniMeets = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const alumniMeets = await getAllAlumniMeetsService();
    res.status(200).json({ success: true, message: "All Alumni Meets", data: alumniMeets });
  } catch (err) { next(err); }
};

export const updateAlumniMeet = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = req.body;
    const parsedClassJoined = JSON.parse(data.classJoined);
    const id = req.params.id;
    const Files = req.files as { images?: (Express.Multer.File & { path: string; filename: string })[]; video?: (Express.Multer.File & { path: string; filename: string })[] };
    const images = Files?.images?.map((file) => ({ image: file.path, imageId: file.filename })) || [];
    const video: string = Files?.video?.[0]?.path || "";
    const videoId: string = Files?.video?.[0]?.filename || "";
    const newData: AlumniMeetInput = { ...data, classJoined: parsedClassJoined };
    const talkVideo = video && { videoLink: video, videoId };
    const talkImages = images.length > 0 && images;
    const deleteImagesIds: string[] = req.body.deleteImagesIds || [];
    if (deleteImagesIds.length > 0) await deleteFromCloudinary(deleteImagesIds as string[]);
    const updatedAlumniMeet = await updateAlumniMeetService(id, newData, talkImages as any, talkVideo as any, req.body.deleteImages || []);
    res.status(200).json({ success: true, message: "Alumni Meet updated successfully", data: updatedAlumniMeet });
  } catch (err: any) { console.log(err.message); next(err); }
};

export const updateMeetMedia = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const Files = req.files as { images?: (Express.Multer.File & { path: string; filename: string })[]; video?: (Express.Multer.File & { path: string; filename: string })[] };
    const images = Files?.images?.map((file) => ({ image: file.path, imageId: file.filename })) || [];
    const video: string = Files?.video?.[0]?.path || "";
    const videoId: string = Files?.video?.[0]?.filename || "";
    const updatedMeet = await updateMeetMediaService(images as any, video, videoId, id);
    res.status(200).json({ success: true, message: "Alumni Meet updated successfully", data: updatedMeet });
  } catch (err: any) { console.log(err.message); next(err); }
};

export const deleteMeetMedia = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const imageIds: string[] = JSON.parse(req.body.imageIds);
    if (imageIds.length > 0) await deleteFromCloudinary(imageIds as string[]);
    const updatedMeet = await deleteMeetMediaService(imageIds, req.params.id);
    res.status(200).json({ success: true, message: "Alumni Meet updated successfully", data: updatedMeet });
  } catch (err: any) { console.log(err.message); next(err); }
};

export const deleteAlumniMeet = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const deletedAlumniMeet = await deleteAlumniMeetService(req.params.id);
    const imagesIds = deletedAlumniMeet?.media?.images.map((image) => image.imageId);
    const videoId = deletedAlumniMeet?.media?.videoId;
    if (imagesIds) await deleteFromCloudinary(imagesIds as string[]);
    if (videoId) await deleteFromCloudinary([videoId as string], 'video');
    res.status(200).json({ success: true, message: "Alumni Meet deleted successfully" });
  } catch (err: any) { console.log(err.message); next(err); }
};

export const getMeetsOnFrontend = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const meets = await getMeetsOnFrontendDao(req.params.type);
    res.status(200).json(meets);
  } catch (err: any) { console.log(err.message); next(err); }
};

export const getSomeRandomAlumni = async (req: Request, res: Response, next: NextFunction) => {
  try { res.status(200).json(await getRandomAlumniDao(4)); } catch (err: any) { next(err); }
};

export const addNewFeedback = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { comment, name, company } = req.body;
    const newFeedback = await addNewFeedbackService(name, company, comment);
    if (newFeedback) res.status(200).json({ status: "succes", feeback: newFeedback });
  } catch (err: any) { console.log(err.message); next(err); }
};

export const fetchRandomFeedbacks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const feedbacks = await getRandomFeedbacksDao(3);
    res.status(200).json({ status: "success", feedbacks });
  } catch (err: any) { console.error("Error fetching feedbacks:", err.message); next(err); }
};

export const getTalksPagination = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 3;
    const data = await getTalksPaginationService(page, limit);
    return res.status(200).json({ status: "success", ...data });
  } catch (err: any) { next(err); }
};

export const feedbackPagination = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, limit } = req.query;
    const data = await feedbackPaginationService(Number(page), Number(limit));
    return res.status(200).json({ status: "success", ...data });
  } catch (err: any) { next(err); }
};
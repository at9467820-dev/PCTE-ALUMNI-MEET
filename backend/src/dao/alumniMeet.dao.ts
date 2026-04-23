import { AlumniModel, AlumniMeetModel, FeedbackModel } from '../config/models';
import { AlumniInput, AlumniMeetInput } from '../types/interface';
import { Alumni, alumniMeetDocument, feedback } from '../types/model.interface';

// ─── Helpers ─────────────────────────────────────────────────────────────────
function toPlain(doc: any) {
  if (!doc) return doc;
  const obj = doc.toObject ? doc.toObject({ versionKey: false }) : { ...doc };
  if (obj._id) obj._id = obj._id.toString();
  return obj;
}

function toMeet(doc: any): alumniMeetDocument {
  if (!doc) return doc;
  const obj = doc.toObject ? doc.toObject({ versionKey: false }) : { ...doc };
  obj._id = obj._id?.toString();
  if (Array.isArray(obj.alumni)) {
    obj.alumni = obj.alumni.map((a: any) =>
      a && typeof a === 'object' && a._id ? { ...a, _id: a._id.toString() } : a?.toString?.() ?? a
    );
  }
  return obj;
}

// ─── Alumni DAOs ──────────────────────────────────────────────────────────────
export const getAllAlumniDao = async (): Promise<Alumni[]> => {
  const docs = await AlumniModel.find().sort({ createdAt: -1 }).lean();
  return docs.map((d: any) => ({ ...d, _id: d._id.toString() })) as Alumni[];
};

export const getAlumniById = async (id: string) => {
  const doc = await AlumniModel.findById(id).lean();
  if (!doc) throw new Error('Alumni not found');
  return { ...(doc as any), _id: (doc as any)._id.toString() } as Alumni;
};

export const addNewAlumniDao = async (data: AlumniInput): Promise<Alumni> => {
  try {
    const doc = await AlumniModel.create({
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
    return { ...toPlain(doc), _id: doc._id.toString() } as Alumni;
  } catch (err: any) {
    if (err.code === 11000) throw new Error(`Duplicate email found: ${data.email}`);
    throw err;
  }
};

export const checkAlumniByIdDao = async (id: string): Promise<boolean> => {
  const doc = await AlumniModel.exists({ _id: id });
  return Boolean(doc);
};

export const checkAlumniMeetsDaoByAlumniId = async (id: string): Promise<boolean> => {
  const doc = await AlumniMeetModel.exists({ alumni: id });
  return Boolean(doc);
};

export const checkAlumniMeetsDaoByid = async (id: string): Promise<boolean> => {
  const doc = await AlumniMeetModel.exists({ _id: id });
  return Boolean(doc);
};

export const deleteAlumniDao = async (id: string): Promise<Alumni | null> => {
  const doc = await AlumniModel.findByIdAndDelete(id).lean();
  if (!doc) throw new Error('Alumni not found');
  return { ...(doc as any), _id: (doc as any)._id.toString() } as Alumni;
};

export const findAlumniByIdDao = async (id: string): Promise<Alumni | null> => {
  const doc = await AlumniModel.findById(id).lean();
  if (!doc) return null;
  return { ...(doc as any), _id: (doc as any)._id.toString() } as Alumni;
};

export const updateAlumniDao = async (id: string, data: AlumniInput): Promise<Alumni | null> => {
  const doc = await AlumniModel.findByIdAndUpdate(
    id,
    {
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
    },
    { new: true, runValidators: true }
  ).lean();
  if (!doc) return null;
  return { ...(doc as any), _id: (doc as any)._id.toString() } as Alumni;
};

// ─── AlumniMeet DAOs ──────────────────────────────────────────────────────────
export const createNewAlumniMeetDao = async (data: AlumniMeetInput): Promise<alumniMeetDocument> => {
  const alumniArray = Array.isArray(data.alumni) ? data.alumni : [data.alumni];
  const doc = await AlumniMeetModel.create({
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

export const getAllAlumniMeetsDao = async () => {
  const docs = await AlumniMeetModel.find().sort({ createdAt: -1 }).populate('alumni').lean();
  if (!docs || docs.length === 0) throw new Error('Alumni Meets not found');
  return docs.map((d: any) => toMeet({ toObject: () => d }));
};

export const updateAlumniMeetDao = async (
  id: string, data: AlumniMeetInput,
  talkImages: any, talkVideo: any, deleteImages: string[]
) => {
  const existing = await AlumniMeetModel.findById(id);
  if (!existing) throw new Error('Alumni Meet not found');

  const alumniArray = data.alumni
    ? (Array.isArray(data.alumni) ? data.alumni : [data.alumni])
    : existing.alumni;

  let imgs: any[] = (existing.media?.images as any[]) || [];
  if (talkImages && Array.isArray(talkImages) && talkImages.length > 0) imgs = [...imgs, ...talkImages];
  if (deleteImages && deleteImages.length > 0) imgs = imgs.filter((img: any) => !deleteImages.includes(img.imageId));

  let vLink = existing.media?.videoLink || '';
  let vId = existing.media?.videoId || '';
  if (talkVideo && talkVideo.videoLink) { vLink = talkVideo.videoLink; vId = talkVideo.videoId; }

  const updated = await AlumniMeetModel.findByIdAndUpdate(id, {
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

export const updateMeetMediaDao = async (images: any[], video: string, videoId: string, id: string) => {
  const existing = await AlumniMeetModel.findById(id);
  if (!existing) throw new Error('Alumni Meet not found');

  const oldVideoId = existing.media?.videoId || '';
  let imgs: any[] = (existing.media?.images as any[]) || [];
  if (images && images.length > 0) imgs = [...imgs, ...images];

  let vLink = existing.media?.videoLink || '';
  let vId = existing.media?.videoId || '';
  if (video) { vLink = video; vId = videoId; }

  const updated = await AlumniMeetModel.findByIdAndUpdate(id, {
    'media.images': imgs,
    'media.videoLink': vLink,
    'media.videoId': vId,
  }, { new: true }).lean();

  const result = toMeet({ toObject: () => updated }) as any;
  result._oldVideoId = oldVideoId;
  return result;
};

export const deleteMeetMediaDao = async (imageIds: string[], id: string) => {
  const existing = await AlumniMeetModel.findById(id);
  if (!existing) throw new Error('Alumni Meet not found');
  const imgs = ((existing.media?.images as any[]) || []).filter((img: any) => !imageIds.includes(img.imageId));
  const updated = await AlumniMeetModel.findByIdAndUpdate(id, { 'media.images': imgs }, { new: true }).lean();
  return toMeet({ toObject: () => updated });
};

export const deleteAlumniMeetDao = async (id: string): Promise<alumniMeetDocument> => {
  const doc = await AlumniMeetModel.findByIdAndDelete(id).populate('alumni').lean();
  if (!doc) throw new Error('Deletion failed. Alumni Meet may have already been deleted.');
  return toMeet({ toObject: () => doc });
};

export const addFeedbackDao = async (name: string, company: string, comment: string): Promise<feedback> => {
  const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&size=128&bold=true&rounded=true`;
  const doc = await FeedbackModel.create({ avatar, name, company, comment });
  return { ...toPlain(doc), _id: doc._id.toString() } as feedback;
};

export const getTalksPaginationDao = async (page: number, limit: number, now: Date) => {
  const skip = (page - 1) * limit;
  const [talks, total] = await Promise.all([
    AlumniMeetModel.find({ time: { $lte: now } }).sort({ createdAt: -1 }).skip(skip).limit(limit).populate('alumni').lean(),
    AlumniMeetModel.countDocuments({ time: { $lte: now } }),
  ]);
  return { talks: talks.map((d: any) => toMeet({ toObject: () => d })), total };
};

export const feedbackPaginationDao = async (page: number, limit: number) => {
  const skip = (page - 1) * limit;
  const [feedbacks, total] = await Promise.all([
    FeedbackModel.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    FeedbackModel.countDocuments(),
  ]);
  return {
    feedbacks: feedbacks.map((d: any) => ({ ...d, _id: d._id.toString() })) as feedback[],
    total,
  };
};

export const getRandomAlumniDao = async (count: number): Promise<Alumni[]> => {
  const docs = await AlumniModel.aggregate([{ $sample: { size: count } }]);
  return docs.map((d: any) => ({ ...d, _id: d._id.toString() })) as Alumni[];
};

export const getMeetsOnFrontendDao = async (type: string) => {
  const now = new Date();
  let docs: any[] = [];
  if (type === 'randomUpcomings')
    docs = await AlumniMeetModel.aggregate([{ $match: { time: { $gt: now } } }, { $sample: { size: 1 } }]);
  else if (type === 'allUpcomings')
    docs = await AlumniMeetModel.find({ time: { $gt: now } }).lean();
  else if (type === 'randomPast')
    docs = await AlumniMeetModel.aggregate([{ $match: { time: { $lt: now } } }, { $sample: { size: 3 } }]);
  else if (type === 'allPast')
    docs = await AlumniMeetModel.find({ time: { $lt: now } }).lean();

  // Populate alumni for aggregation results
  const populated = await Promise.all(
    docs.map(async (d: any) => {
      if (d.alumni && d.alumni.length > 0) {
        const { AlumniModel: AM } = await import('../config/models');
        const alumniDocs = await AM.find({ _id: { $in: d.alumni } }).lean();
        d.alumni = alumniDocs.map((a: any) => ({ ...a, _id: a._id.toString() }));
      }
      return toMeet({ toObject: () => d });
    })
  );
  return populated;
};

export const getRandomFeedbacksDao = async (count: number) => {
  const docs = await FeedbackModel.aggregate([{ $sample: { size: count } }]);
  return docs.map((d: any) => ({ ...d, _id: d._id.toString() })) as feedback[];
};

export const getAllMeetsForReportDao = async () => {
  const docs = await AlumniMeetModel.find().sort({ createdAt: 1 }).populate('alumni').lean();
  return docs.map((d: any) => toMeet({ toObject: () => d }));
};

export const updateMeetStatusesDao = async () => {
  const now = new Date();
  await AlumniMeetModel.updateMany(
    { time: { $lt: now }, status: { $in: ['Upcoming', 'Ongoing'] } },
    { $set: { status: 'Completed' } }
  );
};
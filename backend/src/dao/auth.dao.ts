import { UserModel, BlacklistModel } from '../config/models';
import { userDocument } from '../types/model.interface';
import { RegisterData } from '../types/interface';
import { BadRequestError, NotFoundError } from '../utility/customErrors';
import bcrypt from 'bcryptjs';

function toUser(doc: any): userDocument {
  const obj = doc.toObject ? doc.toObject({ versionKey: false }) : { ...doc };
  obj._id = obj._id?.toString();
  return obj as userDocument;
}

export const isUserExistDao = async (email: string): Promise<boolean> => {
  const doc = await UserModel.exists({ email: email.toLowerCase() });
  return Boolean(doc);
};

export const getFullUserDao = async (id: string) => {
  if (!id) throw new BadRequestError('Invalid user ID format');
  const doc = await UserModel.findById(id);
  if (!doc) throw new NotFoundError('User not found');
  return toUser(doc);
};

export const registerDao = async (data: RegisterData): Promise<userDocument> => {
  const hashedPassword = await bcrypt.hash(data.password, 12);
  let avatarUrl = data.avatar?.url || '';
  if (!avatarUrl) {
    avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=random&color=fff&size=128&bold=true&rounded=true`;
  }
  const doc = await UserModel.create({
    name: data.name,
    email: data.email.toLowerCase(),
    password: hashedPassword,
    avatar: {
      url: avatarUrl,
      public_id: data.avatar?.public_id || '',
    },
  });
  return toUser(doc);
};

export const loginDao = async (data: { email: string; password: string }): Promise<userDocument> => {
  const doc = await UserModel.findOne({ email: data.email.toLowerCase() });
  if (!doc) throw new Error('User not found');
  const isMatch = await bcrypt.compare(data.password, doc.password);
  if (!isMatch) throw new Error('Password is incorrect');
  return toUser(doc);
};

export const logoutDao = async (token: string) => {
  const oneDay = 24 * 60 * 60 * 1000;
  const expiresAt = new Date(Date.now() + oneDay);
  await BlacklistModel.create({ token, expiresAt });
  return { message: 'User logged out successfully' };
};

export const isTokenBlacklistedDao = async (token: string): Promise<boolean> => {
  const doc = await BlacklistModel.exists({ token });
  return Boolean(doc);
};

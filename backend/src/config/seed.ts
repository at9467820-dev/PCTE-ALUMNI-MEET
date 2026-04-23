import bcrypt from 'bcryptjs';
import { UserModel } from './models';

export async function seedDefaultAdmin() {
  const count = await UserModel.countDocuments();
  if (count > 0) return; // already has users, skip

  const hashedPassword = await bcrypt.hash('Admin@1234', 12);
  await UserModel.create({
    name: 'Admin',
    email: 'admin@pcte.edu',
    password: hashedPassword,
    avatar: {
      url: 'https://ui-avatars.com/api/?name=Admin&background=e63946&color=fff&size=128&bold=true&rounded=true',
      public_id: '',
    },
  });

  console.log('✅ Default admin created → email: admin@pcte.edu | password: Admin@1234');
}

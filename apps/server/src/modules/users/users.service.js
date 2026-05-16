const bcrypt = require("bcryptjs");
const prisma = require("../../core/database/prisma");
const { env } = require("../../config");
const { AppError } = require("../../core/errors");

async function updateProfile(userId, data) {
  return prisma.user.update({
    where: { id: userId },
    data: {
      name: data.name,
      avatar: data.avatar,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      avatar: true,
      createdAt: true,
    },
  });
}

async function updatePassword(userId, { currentPassword, newPassword }) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || !(await bcrypt.compare(currentPassword, user.passwordHash))) {
    throw new AppError("Current password is incorrect", 400, "INVALID_PASSWORD");
  }
  const passwordHash = await bcrypt.hash(newPassword, env.bcryptRounds);
  await prisma.user.update({ where: { id: userId }, data: { passwordHash } });
}

module.exports = { updateProfile, updatePassword };

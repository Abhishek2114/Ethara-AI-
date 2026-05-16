const bcrypt = require("bcryptjs");
const prisma = require("../../core/database/prisma");
const { env } = require("../../config");
const { AppError } = require("../../core/errors");
const { tokenService } = require("../../shared/services");

const userSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  jobTitle: true,
  platform: true,
  qualityReviewerId: true,
  reportingToId: true,
  avatar: true,
  isActive: true,
  createdAt: true,
  qualityReviewer: { select: { id: true, name: true, email: true } },
  reportingTo: { select: { id: true, name: true, email: true } },
};

function sanitizeUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    jobTitle: user.jobTitle,
    platform: user.platform,
    qualityReviewerId: user.qualityReviewerId,
    reportingToId: user.reportingToId,
    avatar: user.avatar,
    isActive: user.isActive,
    createdAt: user.createdAt,
    qualityReviewer: user.qualityReviewer,
    reportingTo: user.reportingTo,
  };
}

async function getUserById(userId) {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: userSelect });
  if (!user) throw new AppError("User not found", 404, "USER_NOT_FOUND");
  return sanitizeUser(user);
}

async function register({ email, password, name, role, jobTitle, qualityReviewerId }) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new AppError("Email already registered", 409, "EMAIL_EXISTS");

  const passwordHash = await bcrypt.hash(password, env.bcryptRounds);
  const userRole = role || "TASKER";

  let reviewerId = qualityReviewerId;
  if (userRole === "TASKER" && !reviewerId) {
    const defaultReviewer = await prisma.user.findFirst({
      where: { role: "QUALITY_REVIEWER", isActive: true },
    });
    reviewerId = defaultReviewer?.id;
  }

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      name: name || email.split("@")[0],
      role: userRole,
      jobTitle,
      qualityReviewerId: userRole === "TASKER" ? reviewerId : null,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name || email)}`,
    },
    select: userSelect,
  });

  return sanitizeUser(user);
}

async function login({ email, password }, meta = {}) {
  const user = await prisma.user.findUnique({
    where: { email },
    select: { ...userSelect, passwordHash: true },
  });

  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    throw new AppError("Invalid email or password", 401, "INVALID_CREDENTIALS");
  }
  if (!user.isActive) throw new AppError("Account is deactivated", 403, "ACCOUNT_INACTIVE");

  const profile = sanitizeUser(user);
  const accessToken = tokenService.signAccessToken({
    sub: profile.id,
    email: profile.email,
    role: profile.role,
  });
  const refreshToken = await tokenService.createRefreshToken(profile.id, meta);

  return { user: profile, accessToken, refreshToken };
}

async function refreshSession(refreshToken, meta = {}) {
  const { userId, refreshToken: newRefreshToken } =
    await tokenService.rotateRefreshToken(refreshToken, meta);
  const profile = await getUserById(userId);
  const accessToken = tokenService.signAccessToken({
    sub: profile.id,
    email: profile.email,
    role: profile.role,
  });
  return { user: profile, accessToken, refreshToken: newRefreshToken };
}

async function logout(refreshToken) {
  if (refreshToken) await tokenService.revokeRefreshToken(refreshToken);
}

async function logoutAll(userId) {
  await tokenService.revokeAllUserRefreshTokens(userId);
}

async function listReviewers() {
  return prisma.user.findMany({
    where: { role: "QUALITY_REVIEWER", isActive: true },
    select: { id: true, name: true, email: true },
    orderBy: { name: "asc" },
  });
}

module.exports = {
  register,
  login,
  refreshSession,
  logout,
  logoutAll,
  getUserById,
  sanitizeUser,
  listReviewers,
};

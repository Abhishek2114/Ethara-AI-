const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { env, constants } = require("../../config");
const prisma = require("../../core/database/prisma");
const { AppError } = require("../../core/errors");

function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function signAccessToken(payload) {
  return jwt.sign(payload, env.jwt.accessSecret, {
    expiresIn: env.jwt.accessExpiresIn,
    issuer: constants.JWT_ISSUER,
    audience: constants.JWT_AUDIENCE,
  });
}

function signRefreshToken(payload) {
  return jwt.sign(payload, env.jwt.refreshSecret, {
    expiresIn: env.jwt.refreshExpiresIn,
    issuer: constants.JWT_ISSUER,
    audience: constants.JWT_AUDIENCE,
  });
}

function verifyAccessToken(token) {
  return jwt.verify(token, env.jwt.accessSecret, {
    issuer: constants.JWT_ISSUER,
    audience: constants.JWT_AUDIENCE,
  });
}

function verifyRefreshToken(token) {
  return jwt.verify(token, env.jwt.refreshSecret, {
    issuer: constants.JWT_ISSUER,
    audience: constants.JWT_AUDIENCE,
  });
}

async function createRefreshToken(userId, { userAgent, ipAddress } = {}) {
  const token = signRefreshToken({ sub: userId, type: "refresh" });
  const decoded = jwt.decode(token);
  const expiresAt = new Date(decoded.exp * 1000);

  await prisma.refreshToken.create({
    data: {
      tokenHash: hashToken(token),
      userId,
      expiresAt,
      userAgent,
      ipAddress,
    },
  });

  return token;
}

async function revokeRefreshToken(token) {
  const tokenHash = hashToken(token);
  await prisma.refreshToken.updateMany({
    where: { tokenHash, revokedAt: null },
    data: { revokedAt: new Date() },
  });
}

async function revokeAllUserRefreshTokens(userId) {
  await prisma.refreshToken.updateMany({
    where: { userId, revokedAt: null },
    data: { revokedAt: new Date() },
  });
}

async function rotateRefreshToken(oldToken, { userAgent, ipAddress } = {}) {
  let decoded;
  try {
    decoded = verifyRefreshToken(oldToken);
  } catch {
    throw new AppError("Invalid or expired refresh token", 401, "INVALID_REFRESH_TOKEN");
  }

  if (decoded.type !== "refresh" || !decoded.sub) {
    throw new AppError("Invalid refresh token", 401, "INVALID_REFRESH_TOKEN");
  }

  const tokenHash = hashToken(oldToken);
  const stored = await prisma.refreshToken.findUnique({
    where: { tokenHash },
    include: { user: { select: { id: true, isActive: true } } },
  });

  if (!stored || stored.revokedAt || stored.expiresAt < new Date()) {
    if (stored && !stored.revokedAt) {
      await revokeAllUserRefreshTokens(stored.userId);
    }
    throw new AppError("Refresh token reuse detected or invalid", 401, "REFRESH_TOKEN_REUSE");
  }

  if (!stored.user.isActive) {
    throw new AppError("Account is deactivated", 403, "ACCOUNT_INACTIVE");
  }

  await prisma.refreshToken.update({
    where: { id: stored.id },
    data: { revokedAt: new Date() },
  });

  const newToken = await createRefreshToken(stored.userId, { userAgent, ipAddress });
  return { userId: stored.userId, refreshToken: newToken };
}

async function cleanupExpiredTokens() {
  await prisma.refreshToken.deleteMany({
    where: {
      OR: [
        { expiresAt: { lt: new Date() } },
        {
          revokedAt: {
            not: null,
            lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          },
        },
      ],
    },
  });
}

module.exports = {
  hashToken,
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  createRefreshToken,
  revokeRefreshToken,
  revokeAllUserRefreshTokens,
  rotateRefreshToken,
  cleanupExpiredTokens,
};

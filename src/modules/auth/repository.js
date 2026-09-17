import { prisma } from "../../prisma/client.js";

export const authRepository = {
  findUserByEmail: async (email) => {
    return await prisma.User.findUnique({ where: { email } });
  },
  findUser: async (id) => {
    return await prisma.User.findUnique({ where: { id } });
  },
  createNewUser: async ({ firstName, lastName, email, role, passwordHash }) => {
    const newUser = await prisma.User.create({
      data: {
        firstName,
        lastName,
        email,
        role,
        passwordHash,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        passwordChangeRequired: true,
      },
    });
    return newUser;
  },
  createRefreshToken: async ({ userId, refreshHash, expiresAt }) => {
    await prisma.refreshToken.create({
      data: {
        userId,
        token: refreshHash,
        expiresAt,
      },
    });
  },
  changeUserPassword: async (userId, newPasswordHash) => {
    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newPasswordHash, passwordChangeRequired: false },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        passwordChangeRequired: true,
      },
    });
  },
};

import { prisma } from "../../prisma/client.js";

export const authRepository = {
  findUserByEmail: async (email) => {
    return await prisma.user.findUnique({ where: { email } });
  },
  findUser: async (id) => {
    return await prisma.user.findUnique({ where: { id } });
  },
  createNewUser: async ({
    firstName,
    lastName,
    email,
    role,
    password,
    departmentId,
  }) => {
    const result = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          firstName,
          lastName,
          email,
          role,
          passwordHash: password,
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
      let userInfo = null;
      switch (role) {
        case "STUDENT":
          userInfo = await tx.studentInfo.create({
            data: {
              userId: newUser.id,
              departmentId,
            },
            select: {
              userId: true,
              department: {
                select: {
                  id: true,
                  name: true,
                },
              },
              parentId: true,
            },
           
          });
          break;
        case "INSTRUCTOR":
          userInfo = await tx.instructorInfo.create({
            data: {
              userId: newUser.id,
              departmentId,
            },
            select: {
              userId: true,
              department: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          });
          break;
        case "PARENT":
          userInfo = await tx.parentInfo.create({
            data: {
              userId: newUser.id,
            },
          });
          break;
        case "default":
          break;
      }

      return { newUser, userInfo };
    });

    return result;
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
  findRefreshToken: async ({ hashedToken }) => {
    return await prisma.refreshToken.findUnique({
      where: { token: hashedToken },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            role: true,
            email: true,
          },
        },
      },
    });
  },
  revokeRefreshToken: async ({ hashedToken }) => {
    await prisma.refreshToken.updateMany({
      where: { token: hashedToken, isRevoked: false },
      data: {
        isRevoked: true,
      },
    });
  },
  revokeAllRefreshTokens: async (userId) => {
    await prisma.refreshToken.updateMany({
      where: { userId, isRevoked: false },
      data: { isRevoked: true },
    });
  },
  changeUserPassword: async (userId, newPasswordHash) => {
    return await prisma.user.update({
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

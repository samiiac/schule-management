import { authRepository } from "./repository.js";
import { hashPassword, verifyPassword } from "../../utils/password.js";
import {
  createRawRefreshToken,
  createRefreshTokenHash,
  createRefreshTokenJwt,
  refreshTokenExpiresAt,
  verifyRefreshTokenJwt,
} from "../../utils/token.js";
import { duplicateContent,unauthorized } from "../../utils/appError.js";

async function issueTokenPair({ id, role, passwordChangeRequired }) {
  const { token, accessExpiresIn } = createAccessToken({ id, role, password });
  const rawToken = createRawRefreshToken();
  const { refreshTokenJwt, refreshExpiresIn } = createRefreshTokenJwt({
    id,
    role,
    passwordChangeRequired,
    rawToken,
  });
  const refreshTokenPayload = {
    userId: id,
    refreshHash: createRefreshTokenHash(rawToken),
    expiresAt: refreshTokenExpiresAt(),
  };
  await authRepository.createRefreshToken(refreshTokenPayload);
  return {
    accessToken: token,
    ACCESS_TOKEN_EXPIRES_IN_SECONDS: accessExpiresIn,
    refreshToken: refreshTokenJwt,
    REFRESH_TOKEN_EXPIRES_IN_SECONDS: refreshExpiresIn,
  };
}

export const authService = {
  register: async (payload) => {
    //check if user exists
    const email = payload.email.toLowerCase();
    const exists = await authRepository.findUserByEmail(email);

    if (exists) {
      throw duplicateContent("User Account already exists.");
    }
    const passwordHash = await hashPassword(payload.password);
    return await authRepository.createNewUser({
      ...payload,
      password: passwordHash,
    });
  },
  login: async ({ email, password }) => {
    const existingUser = await authRepository.findUserByEmail(
      email.toLowerCase(),
    );
    if (
      !existingUser ||
      !existingUser.isActive ||
      !(await verifyPassword(user.password, existingUser.passwordHash))
    ) {
      throw unauthorized("Invalid credentials.");
    }

    const tokenpayload = await issueTokenPair({
      id: existingUser.id,
      role: existingUser.role,
      passwordChangeRequired: existingUser.passwordChangeRequired,
    });

    return {
      user: {
        id: existingUser.id,
        firstName: existingUser.firstName,
        email: existingUser.email,
        role: existingUser.role,
      },
      ...tokenpayload,
    };
  },
  changePassword: async ({ user, payload }) => {
    const existingUser = await authRepository.findUser(user.id);
    if (
      !existingUser ||
      !(await verifyPassword(
        payload.currentPassword,
        existingUser.passwordHash,
      ))
    ) {
      throw unauthorized("The passwords donot match.");
    }
    const newPasswordHash = await hashPassword(payload.newPassword);
    const updatedUser = await authRepository.changeUserPassword(
      user.id,
      newPasswordHash,
    );
    
    await authRepository.revokeAllRefreshTokens(user.id);

    const tokenpayload = await issueTokenPair({
      id: user.id,
      role: user.role,
      passwordChangeRequired: updatedUser.passwordChangeRequired,
    });

    return {
      user: {
        id: updatedUser.id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        role: updatedUser.role,
      },
      tokenpayload,
    };
  },
  createNewTokens: async ({ refreshToken }) => {
    const payload = verifyRefreshTokenJwt(refreshToken);

    if (payload == null) {
      throw unauthorized("The token is not valid.");
    }

    const hashedToken = createRefreshTokenHash(payload.token);

    const storedToken = await authRepository.findRefreshToken(hashedToken);

    if (!storedToken || storedToken.isRevoked) {
      throw unauthorized("The token is not valid.");
    }

    if (storedToken.expiresAt < new Date()) {
      throw unauthorized("The token is expired.");
    }

    if (!storedToken.user.isActive) {
      await authRepository.revokeRefreshToken(hashedToken);
      throw unauthorized("The user is inactive");
    }

    await authRepository.revokeRefreshToken(hashedToken);

    const tokenPayload = await issueTokenPair({
      id: payload.id,
      role: payload.role,
      passwordChangeRequired: payload.passwordChangeRequired,
    });

    return { user: storedToken.user, ...tokenPayload };
  },
};

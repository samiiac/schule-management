import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { randomBytes, createHash } from "node:crypto";

export function createAccessToken({ id, role, passwordChangeRequired }) {
  const payload = {
    id,
    role,
    passwordChangeRequired,
    type: "access",
  };
  const token = jwt.sign( payload , env.ACCESS_JWT_SECRET, {
    algorithm: "HS256",
    expiresIn: env.ACCESS_TOKEN_EXPIRES_IN_SECS,
  });
  return { token, acsessExpiresIn: env.ACCESS_TOKEN_EXPIRES_IN_SECS };
}

export function verifyAccessToken(token) {
  try {
    const payload = jwt.verify(token, env.ACCESS_JWT_SECRET, {
      algorithms: ["HS256"],
    });

    if (typeof payload == "string") {
      return null;
    }

    if (payload.type !== "access") {
      return null;
    }
    if (!payload.id || !payload.role){
      return null;
    }
    return payload
  } catch (error) {
    return null;
  }
}

export const createRawRefreshToken = () =>
  randomBytes(48).toString("base64url");

export function createRefreshTokenJwt({
  id,
  role,
  passwordChangeRequired,
  rawToken,
}) {
  const payload = {
    id,
    role,
    passwordChangeRequired,
    token: rawToken,
    type: "refresh",
  };
  const signedToken = jwt.sign({ payload }, env.REFRESH_JWT_SECRET, {
    algorithm: "HS256",
    expiresIn: env.REFRESH_TOKEN_EXPIRES_IN_SECS,
  });
  return {
    refreshTokenJwt: signedToken,
    refreshExpiresIn: env.REFRESH_TOKEN_EXPIRES_IN_SECS,
  };
}

export function verifyRefreshTokenJwt(token){
 try{
  const payload = jwt.verify(token,env.REFRESH_JWT_SECRET,{
    algorithms:['HS256']
  })
  if(typeof payload == 'string'){
     return null
  }
  if(payload.type != 'refresh'){
    return null
  }
  if(!payload.id || !payload.role){
    return null
  }
  return payload
 }catch(error){
  return null
 }
}

export const createRefreshTokenHash = (rawToken) =>
  createHash("SHA-256").update(rawToken).digest("hex");

export function refreshTokenExpiresAt() {
  return new Date(Date.now() + env.REFRESH_TOKEN_EXPIRES_IN_SECS * 1000);
}

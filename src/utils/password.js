import * as argon2 from "argon2";

const argonOptions = {
  type: argon2.argon2id, // Ensures Argon2id is used instead of Argon2i or Argon2d
  memoryCost: 2 ** 16, // 64 MB RAM
  timeCost: 3,
  parallelism: 1,
};

export async function hashPassword(password) {
  return await argon2.hash(password, argonOptions);
}

export async function verifyPassword(password, passwordHash) {
  try {
    return await argon2.verify(passwordHash, password);
  } catch (error) {
    return false;
  }
}

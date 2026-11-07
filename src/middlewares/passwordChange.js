import { changePassword, unauthorized } from "../utils/appError.js";

export function passwordChange(req, res, next) {
  const user = req.user;
  if (!user) {
    throw unauthorized();
  }
  if (user.passwordChangeRequired === true) {
    throw changePassword();
  }
  next();
}

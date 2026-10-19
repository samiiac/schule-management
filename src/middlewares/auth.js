import { verifyAccessToken } from "../utils/token.js";
import { forbidden, unauthorized } from "../utils/appError.js";
import { hasPermissions } from "../modules/rbac/service.js";

export function authenticate(req, res, next) {
  try {
    const headers = req.headers["authorization"];
    if (!headers) {
      throw unauthorized("No auth headers found");
    }
    const token = headers.split(" ")?.[1] ?? null;
    if (!token) {
      throw unauthorized("No auth token found");
    }

    const payload = verifyAccessToken(token);
    if (payload == null) {
      throw unauthorized("Invalid token.");
    }
    req.user = payload;
    next();
  } catch (error) {
    next(error);
  }
}

export function requirePermission(permissions) {
  return (req, res, next) => {
    try {
      
      const userRole = req.user.role;
      let allowed = false;
      for (let p of permissions) {
        allowed |= hasPermissions(userRole, p);
      }
      if (!allowed) {
        throw forbidden(
          "You donot have permission for performing this action.",
        );
      }
      next();
    } catch (error) {
      next(error);
    }
  };
}

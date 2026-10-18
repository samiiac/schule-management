import { PrismaClientInitializationError } from "@prisma/client/runtime/client";
import { AppError } from "../utils/appError.js";
import { ZodError } from "zod";
import {

  PrismaClientKnownRequestError,
  PrismaClientRustError,
  PrismaClientRustPanicError,
  PrismaClientValidationError,
} from "@prisma/client-runtime-utils";

const prismaError = {
  P2002: {
    status: 409,
    code: "CONFLICT",
    message: "A record with these values already exists.",
  },
  P2003: {
    status: 409,
    code: "FOREIGN_KEY_CONSTRAINT",
    message: "Related record is missing or still in use.",
  },
  P2014: {
    status: 409,
    code: "INVALID_REFERENCE",
    message: "Operation conflicts with existing relations.",
  },
  P2025: {
    status: 404,
    code: "NOT_FOUND",
    message: "The requested record was not found.",
  },
};
export function errorHandler(error,req,res,next) {

   
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      success: false,
      code: error.code,
      message: error.message,
      details: error.details,
    });
  }

  if (error instanceof ZodError) {
    return res.status(400).json({
      success: false,
      code: "VALIDATION_ERROR",
      message: "Validation failed",
      details: error.flatten(),
    });
  }

  if (error instanceof PrismaClientKnownRequestError) {
    const mappedError = prismaError[error.code];
    if (!mappedError) {
      return res.status(400).json({
        success: false,
        code: "DATABASE_ERROR",
        message: "The database couldnt handle the request.",
      });
    }
    return res.status(mappedError.statusCode).json({
      success: false,
      code: mappedError.code,
      message: mappedError.message,
    });
  }

  if (error instanceof PrismaClientValidationError) {
    console.log(error.message);
    return res.status(400).json({
      success: false,
      code: "VALIDATION_ERROR",
      message: "Invalid requestd data.",
    });
  }

  if (
    error instanceof PrismaClientInitializationError ||
    error instanceof PrismaClientRustError ||
    error instanceof PrismaClientRustPanicError
  ) {
    return res.status(503).json({
      success: false,
      code: "DATABASE_UNAVAILABLE",
      message: "The service is currently unavailable.",
    });
  }

  console.log("Unhandled error", error);
  return res.status(500).json({
    success: false,
    code: "SERVER_ERROR",
    message: "Unknown error occured.Please try again later.",
  });
}

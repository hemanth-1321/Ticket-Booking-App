import { RequestHandler } from "express";
import { middleware } from ".";
import { SUPERADMIN_JWT_PASSWORD } from "../routes/config";

export const superAdminMiddleware: RequestHandler = middleware(
  SUPERADMIN_JWT_PASSWORD
);

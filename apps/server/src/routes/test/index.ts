import { AdminType, client } from "@repo/db/client";
import { Router } from "express";
import jwt from "jsonwebtoken";
import { ADMIN_JWT_PASSWORD } from "../config";
import { createAdmin } from "../../controllers/test";
const router: Router = Router();

router.post("/create-admin", async (req, res) => {
  const { number, name } = req.body;
  const token = await createAdmin(number, name, AdminType.Creator);
  res.json({
    token,
  });
});

router.post("/create-admin", async (req, res) => {
  const { number, name } = req.body;
  const token = await createAdmin(number, name, AdminType.SuperAdmin);
  res.json({
    token,
  });
});

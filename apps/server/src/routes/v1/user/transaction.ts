import { generateToken } from "authenticator";
import { Router } from "express";
import { client } from "@repo/db/client";
import jwt from "jsonwebtoken";
import { userMiddleware } from "../../../middleware/user";
const router: Router = Router();

router.get("/", userMiddleware, async (req, res) => {
  const transactions = await client.payment.findMany({
    where: {
      userId: req.userId,
    },
  });
  res.status(200).json({
    transactions,
  });
});
export default router;

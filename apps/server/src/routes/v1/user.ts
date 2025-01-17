import { verifyToken, generateToken } from "authenticator";
import { Router } from "express";
import { client } from "@repo/db/client";
import jwt from "jsonwebtoken";
import { JWT_PASSWORD } from "../config";
import { sendMessage } from "../../utils/twilio";
const router: Router = Router();
router.post("/signup", async (req, res) => {
  const number = req.body.number;
  const otp = generateToken(number + "SIGNUP");
  client.user.upsert({
    where: {
      number,
    },

    create: {
      number,
    },
    update: {},
  });
  if (process.env.NODE_ENV == "production") {
    try {
      await sendMessage(
        `+91 ${number}`,
        `Your otp for logging into latent is ${otp}`
      );
    } catch (error: any) {
      console.error(error.message);
    }
  }

  res.json({
    id: otp,
  });
});

router.post("/signup/verify", async (req, res) => {
  const number = req.body.number;
  const name = req.body.name;
  if (!verifyToken(number + "SIGNUP", req.body.otp)) {
    res.json({
      message: "Invalid token",
    });
    return;
  }
  const userId = await client.user.update({
    where: {
      number,
    },
    data: {
      name,
      verified: true,
    },
  });

  const token = jwt.sign(
    {
      userId,
    },
    JWT_PASSWORD
  );
  res.json({});
});
export default router;

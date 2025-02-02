import { generateToken } from "authenticator";
import { Router } from "express";
import { client } from "@repo/db/client";
import jwt from "jsonwebtoken";
import { ADMIN_JWT_PASSWORD, JWT_PASSWORD, TOTP_SECRET } from "../../config";
import { sendMessage } from "../../../utils/twilio";
import { getToken, verifyToken } from "../../../utils/totp";
const router: Router = Router();

router.post("/signin", async (req, res) => {
  const { number, name } = req.body;

  const otp = generateToken(number + "ADMIN_AUTH");

  try {
    const admin = await client.admin.upsert({
      where: {
        number,
      },
      create: {
        number,
        name,
        type: "Creator",
      },
      update: {},
    });

    if (process.env.NODE_ENV == "production") {
      try {
        await sendMessage(
          `+91 ${number}`,
          `Your admin otp for logging into latent is ${otp}`
        );
      } catch (error: any) {
        console.error(error.message);
        res.status(500).json({
          message: "Could not send otp",
        });
      }
    }

    res.json({
      message: "otp sent",
      admin,
    });
  } catch (error: any) {
    console.log(error.message);
    res.status(411).json({
      message: "User invalid",
      error,
    });
  }
});

router.post("/signin/verify", async (req, res) => {
  const number = req.body.number;

  const otp = req.body.otp;
  try {
    if (
      process.env.NODE_ENV === "production" &&
      !verifyToken(number, "ADMIN_AUTH", otp)
    ) {
      res.json({
        message: "Invalid token",
      });
      return;
    }
    const user = await client.admin.update({
      where: {
        number,
      },
      data: {
        verified: true,
      },
    });

    const token = jwt.sign(
      {
        userId: user.id,
      },
      ADMIN_JWT_PASSWORD
    );

    res.json({
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "verification failed",
    });
  }
});
export default router;

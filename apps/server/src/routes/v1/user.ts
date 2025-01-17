import { generateToken } from "authenticator";
import { Router } from "express";
import { client } from "@repo/db/client";
import jwt from "jsonwebtoken";
import { JWT_PASSWORD, TOTP_SECRET } from "../config";
import { sendMessage } from "../../utils/twilio";
import { getToken, verifyToken } from "../../utils/totp";
const router: Router = Router();

router.post("/signup", async (req, res) => {
  const number = req.body.number;
  const otp = getToken(number, "Auth");

  try {
    const user = await client.user.upsert({
      where: {
        number,
      },
      create: {
        number,
        name: "",
      },
      update: {},
    });
  } catch (error: any) {
    console.error(error.message);
    res.status(500).json({
      messgae: "server error",
    });
  }
  if (process.env.NODE_ENV === "production") {
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
    message: "message sent",
  });
});

router.post("/signup/verify", async (req, res) => {
  const { number, name, otp } = req.body;
  if (
    process.env.NODE_ENV === "production" &&
    !verifyToken(number, "Auth", otp)
  ) {
    res.json({
      message: "Invalid token",
    });
    return;
  }
  const user = await client.user.update({
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
      userId: user.id,
    },
    JWT_PASSWORD
  );
  res.json({
    token,
  });
});

router.post("/signin", async (req, res) => {
  const number = req.body.number;
  const otp = generateToken(number + "SIGNUP");

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
    message: "otp sent",
  });
});

router.post("/signin/verify", async (req, res) => {
  const { number, otp } = req.body;
  if (!verifyToken(number + "SIGNUP", otp)) {
    res.json({
      message: "Invalid token",
    });
    return;
  }
  const user = await client.user.findFirstOrThrow({
    where: {
      number,
    },
  });

  const token = jwt.sign(
    {
      userId: user.id,
    },
    JWT_PASSWORD
  );
  res.json({
    token,
  });
});
export default router;

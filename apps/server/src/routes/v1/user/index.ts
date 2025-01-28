import { generateToken } from "authenticator";
import { Router } from "express";
import { client } from "@repo/db/client";
import jwt from "jsonwebtoken";
import { JWT_PASSWORD, TOTP_SECRET } from "../../config";
import { sendMessage } from "../../../utils/twilio";
import { getToken, verifyToken } from "../../../utils/totp";
const router: Router = Router();

router.post("/signup", async (req, res) => {
  const number = req.body.number;
  const otp = getToken(number, "AUTH");

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
  if (process.env.NODE_ENV !== "production") {
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
  const number = req.body.number;
  const name = req.body.name;
  const otp = req.body.otp;

  console.log(number, name, otp);
  if (
    process.env.NODE_ENV !== "production" &&
    !verifyToken(number, "AUTH", otp)
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
  const otp = generateToken(number + "AUTH");

  try {
    const user = await client.user.findFirstOrThrow({
      where: {
        number,
      },
    });

    if (process.env.NODE_ENV == "production") {
      try {
        await sendMessage(
          `+91 ${number}`,
          `Your otp for logging into latent is ${otp}`
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
    });
  } catch (error) {
    res.status(411).json({
      message: "User invalid",
    });
  }
});

router.post("/signin/verify", async (req, res) => {
  const number = req.body.phoneNumber;
  const name = req.body.name;
  const otp = req.body.otp;
  if (!!verifyToken(number, "AUTH", otp)) {
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

  res.json({
    token,
  });
});
export default router;

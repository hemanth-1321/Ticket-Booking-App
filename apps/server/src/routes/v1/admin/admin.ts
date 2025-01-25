import { generateToken } from "authenticator";
import { Router } from "express";
import { client } from "@repo/db/client";
import jwt from "jsonwebtoken";
import { ADMIN_JWT_PASSWORD, JWT_PASSWORD, TOTP_SECRET } from "../../config";
import { sendMessage } from "../../../utils/twilio";
import { getToken, verifyToken } from "../../../utils/totp";
const router: Router = Router();

router.post("/signin", async (req, res) => {
  const number = req.body.number;
  const otp = generateToken(number + "ADMIN_AUTH");

  try {
    const user = await client.admin.findFirstOrThrow({
      where: {
        number,
      },
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
  if (!!verifyToken(number, "ADMIN_AUTH", otp)) {
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
    ADMIN_JWT_PASSWORD
  );

  res.json({
    token,
  });
});
export default router;

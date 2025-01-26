import { generateToken } from "authenticator";
import { Router } from "express";
import { client } from "@repo/db/client";
import jwt from "jsonwebtoken";
const router: Router = Router();

router.get("/events", async (req, res) => {
  const events = await client.event.findMany({
    where: {
      published: true,
      ended: false,
    },
  });

  res.json({
    events,
  });
});
export default router;

import { Router } from "express";
import userRouter from "./user";
import adminRouter from "./admin/admin";
import adminEventRouter from "./admin/events";
import adminLocationRouter from "./admin/location";
const router: Router = Router();
router.use("/user", userRouter);
router.use("/admin", adminRouter);
router.use("/admin/event", adminEventRouter);
router.use("/admin/location", adminLocationRouter);

if (process.env.NODE_ENV != "production") {
  router.use("/test", testRouter);
}
export default router;

import { Router } from "express";
import userRouter from "./user";
import adminRouter from "./admin/admin";
import adminEventRouter from "./admin/events";
import adminLocationRouter from "./admin/location";
import testRouter from "../test/index";
import bookingRouter from "./user/booking";
import transactionRouter from "./user/transaction";
import superAdminRouter from "../superAdmin/events";
const router: Router = Router();

router.use("/user/bookings", bookingRouter);
router.use("/user/transactions", transactionRouter);
router.use("/user", userRouter);
router.use("/admin", adminRouter);
router.use("/admin/event", adminEventRouter);
router.use("/admin/location", adminLocationRouter);
router.use("/superAdmin", superAdminRouter);
if (process.env.NODE_ENV !== "production") {
  router.use("/test", testRouter);
}

export default router;

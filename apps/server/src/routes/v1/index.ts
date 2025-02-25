import { Router } from "express";
import userRouter from "./user";
import adminRouter from "./admin/admin";
import adminEventRouter from "./admin/events";
import testRouter from "../test/index";
import bookingRouter from "./user/booking";
import transactionRouter from "./user/transaction";
import superAdminRouter from "../superAdmin/events";
import superAdminAuth from "../superAdmin/index";
import SeatType from "../v1/admin/seats";

const router: Router = Router();

router.use("/user/bookings", bookingRouter);
router.use("/user/transactions", transactionRouter);
router.use("/user", userRouter);
router.use("/admin", adminRouter);
router.use("/admin/event", adminEventRouter);
router.use("/superAdmin", superAdminRouter);
router.use("/superAdmin/auth", superAdminAuth);
router.use("/admin/seats", SeatType);
if (process.env.NODE_ENV !== "production") {
  router.use("/test", testRouter);
}

export default router;

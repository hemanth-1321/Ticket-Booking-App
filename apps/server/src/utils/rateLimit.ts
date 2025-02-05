import rateLimit from "express-rate-limit";

export const bookingLimter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: "Too many booking requests, please try Again later",
  keyGenerator: (req) => req.ip ?? "",
});

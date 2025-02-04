import crypto from "crypto";
export function VerifyPayments(
  orderId: string,
  paymentId: string,
  signature: string
) {
  const secret = process.env.RAZORPAY_SECRET ?? "";

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(orderId + "|" + paymentId)
    .digest("hex");
  return expectedSignature === signature;
}

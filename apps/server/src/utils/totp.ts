import { generateToken, verifyToken as verifyTokenLib } from "authenticator";
import { TOTP_SECRET } from "../routes/config";

export function getToken(number: string, type: "Auth") {
  const otp = generateToken(number + type + TOTP_SECRET);
}

export function verifyToken(number: string, type: "Auth", otp: string) {
  return verifyTokenLib(number + type + TOTP_SECRET, otp);
}

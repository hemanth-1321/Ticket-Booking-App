import { generateToken, verifyToken as verifyTokenLib } from "authenticator";
import { TOTP_SECRET } from "../routes/config";
type TokenType = "AUTH" | "ADMIN_AUTH";
export function getToken(number: string, type: TokenType): string {
  return generateToken(number + type + TOTP_SECRET); // Return the generated OTP
}

export function verifyToken(number: string, type: TokenType, otp: string) {
  return verifyTokenLib(number + type + TOTP_SECRET, otp);
}

import { createHmac } from "crypto";

export function signJwtLike(payload: string) {
  const secret = process.env.JWT_SECRET || "development-secret";
  return createHmac("sha256", secret).update(payload).digest("hex");
}

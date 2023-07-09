import { sign, verify } from "jsonwebtoken";
import { JwtObject } from "./types";

export function signJwt(obj: JwtObject): string {
  return sign(obj, getJwtSecret(), {
    expiresIn: "15d",
  });
}

// throws error when bad token
export function verifyJwt(token: string): JwtObject {
  return verify(token, getJwtSecret()) as JwtObject;
}

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error("Missing Jwt Token");
    process.exit(1);
  }

  return secret;
}

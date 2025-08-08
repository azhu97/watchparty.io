import jwt, { JwtPayload, Secret, SignOptions } from "jsonwebtoken";
import { JwtUserPayload } from "../types/index";

if (!process.env.JWT_SECRET) {
    throw new Error("Missing JWT_SECRET");
}

const JWT_SECRET: Secret = process.env.JWT_SECRET;

export const signToken = (
  payload: JwtUserPayload,
  options: SignOptions = { expiresIn: "24h" }
): string => {
  return jwt.sign(payload, JWT_SECRET, options);
};

export const verifyToken = (token: string): JwtPayload | string => {
  return jwt.verify(token, JWT_SECRET);
};

export const decodeToken = (token: string): JwtPayload | string | null  => {
  return jwt.decode(token);
};

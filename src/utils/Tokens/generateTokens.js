import jwt from "jsonwebtoken";
import { v4 as uuidV4 } from "uuid";
import { connection } from "../services/redis.js";
import env from "dotenv";
env.config({ path: "./.dev.env" });
export const generateTokens = async ({ res, role = "user", id }) => {
  const jti = uuidV4();
  await connection.set(
    `refreshToken:${id}:${jti}`,
    "1",
    "EX",
    60 * 60 * 24 * 7
  );
  const accessToken = jwt.sign(
    {
      id: id,
      role: role,
    },
    process.env.SECRET_KEY,
    {
      expiresIn: "30m",
    }
  );
  const refreshToken = jwt.sign(
    {
      id: id,
      role: role,
      jti,
    },
    process.env.SECRET_KEY,
    {
      expiresIn: "7d",
    }
  );
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });
  return accessToken;
};

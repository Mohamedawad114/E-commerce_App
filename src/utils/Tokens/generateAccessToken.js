import jwt from "jsonwebtoken";
import env from "dotenv";
env.config({ path: "./dev.env" });

export const generateAccessToken = ({ id, role }) => {
  const accessToken = jwt.sign({ id: id, role: role }, process.env.SECRET_KEY, {
    expiresIn: "30m",
  });

  return accessToken;
};

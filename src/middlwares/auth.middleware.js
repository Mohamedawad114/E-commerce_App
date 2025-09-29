import jwt from "jsonwebtoken";
import User from "../DB/models/user.model.js";
import env from "dotenv"
env.config({ path: "./.dev.env" });
async function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  try {
    if (!token) return res.status(401).json({ message: `Token not provided` });
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.findById(decoded.id);
    if (!user) throw new Error(`user not found`, { cause: 404 });
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

export const validationAdmin = (req, res, next) => {
  if (req.user.role != "Admin") {
    throw new Error(`you 're not auhorizated ,admin only`, { cause: 403 });
  }
  next();
};

export default verifyToken;

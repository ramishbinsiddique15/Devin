import jwt from "jsonwebtoken";
import redisClient from "../services/redis.service.js";
export const authUser = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Not authorized" });

    const isBlacklisted = await redisClient.get(token);
    if (isBlacklisted) {
      res.cookie("token", "");
      return res
        .status(401)
        .json({ error: "Not authorized, token blacklisted" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Not authorized, token failed" });
  }
};

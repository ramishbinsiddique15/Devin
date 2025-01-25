import jwt from "jsonwebtoken";

export const authUser = (req, res, next) => {
  try {
    // Extract token from cookies or Authorization header
    const token =
      req.cookies?.token || req.headers.authorization?.split(" ")[1];

    // Check if token is missing
    if (!token) {
      return res.status(401).json({ error: "Not authorized. Token missing." });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach decoded user information to the request object
    req.user = decoded;

    next(); // Proceed to the next middleware
  } catch (error) {
    // Handle specific JWT errors
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Invalid token." });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expired." });
    }

    // Generic error handling
    return res.status(500).json({ error: "Server error." });
  }
};

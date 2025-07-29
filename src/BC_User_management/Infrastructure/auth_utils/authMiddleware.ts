import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret";

export interface AuthenticatedRequest extends Request {
  user?: any;
}

export function withAuth(
  handler: (req: AuthenticatedRequest, res: Response, next: NextFunction) => any
) {
  return function (req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ error: "Missing or invalid Authorization header" });
    }

    const token = authHeader.split(" ")[1];

    try {
      const payload = jwt.verify(token, JWT_SECRET);
      (req as AuthenticatedRequest).user = payload;
      return handler(req as AuthenticatedRequest, res, next);
    } catch (err) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }
  };
}

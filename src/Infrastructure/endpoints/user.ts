import express from "express";
import { withAuth } from "../auth_utils/authMiddleware";

const router = express.Router();

router.get(
  "/me",
  withAuth((req, res) => {
    return res.json({ user: "Profile User" });
  })
);

export default router;

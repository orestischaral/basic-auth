import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import passport from "passport";
import bodyParser from "body-parser";
import authRoutes from "./BC_User_management/Infrastructure/endpoints/auth";
import userRoutes from "./BC_User_management/Infrastructure/endpoints/user";
import "./BC_User_management/Infrastructure/auth_utils/googleStrategy";

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(passport.initialize());

app.use(authRoutes);
app.use(userRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

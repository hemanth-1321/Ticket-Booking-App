import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import "./types";
dotenv.config();
import v1Router from "./routes/v1";
const app = express();
app.use(express.json());
app.use("/api/v1", v1Router);

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({
    message: "Internal server error",
  });
});
app.listen(process.env.PORT || 8080);

const express = require("express");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();
require("dotenv").config();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const postRouter = require("./routes/post");

app.use("/api", authRouter);
app.use("/api",postRouter);

connectDB()
  .then(() => {
    console.log("Database connection established...");
    app.listen(process.env.PORT, () => {
      console.log("Server is successfully listening on "+process.env.port+"...");
    });
  })
  .catch((err) => {
    console.error("Database cannot be connected!!");
  });
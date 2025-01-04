const express = require("express");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
const app = express();
require("dotenv").config();
console.log(process.env.port);
app.use(
  cors({
    origin: ["http://localhost:5173","https://pure-dusk-11100-520bccfde42a.herokuapp.com"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const postRouter = require("./routes/post");

app.use("/api", authRouter);
app.use("/api",postRouter);

const parentDirectory = path.resolve(__dirname, "..","..");

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(parentDirectory, "/frontend/dist")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(parentDirectory, "frontend", "dist", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running..");
  });
}

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
const express = require("express");
const cors = require("cors");
// const jwt = require("jsonwebtoken");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 8000;

// middleware
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://hmrakib.com",
      "https://hmrakib.web.app",
    ],
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

app.listen(port, () => {
  console.log("server is running....");
});

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const routers = require("./routers/routers.js");
const cors = require("cors");
const cookieParser = require("cookie-parser");

app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routers);

app.use((error, req, res, next) => {
  console.error(error);
  const status = error.status || 500;
  const message = error.message || "Something broke!";
  res.status(status).send({ message });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

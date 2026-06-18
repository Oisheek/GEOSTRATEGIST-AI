const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes =
  require("./routes/auth.routes");

const regionRoutes =
  require("./routes/region.routes");

const conflictRoutes =
  require(
    "./routes/conflict.routes"
  );
const chatRoutes =
  require("./routes/chat.routes");

const newsRoutes =
  require("./routes/news.routes");

const dashboardRoutes =
  require("./routes/dashboard.routes");

const app = express();

app.use(
  cors({
    origin: [
      "https://geo-strategist-ai-wfkw.vercel.app/"
    ],
    credentials: true,
  })
);

app.use(express.json());


app.use(cookieParser());

app.use(
  "/api/conflicts",
  conflictRoutes
);


app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/regions",
  regionRoutes
);

app.use(
  "/api/news",
  newsRoutes
);

app.use(
  "/api/chat",
  chatRoutes
);
app.use(
  "/api/intelligence",
  require(
    "./routes/intelligence.routes"
  )
);
app.use(
  "/api/dashboard",
  dashboardRoutes
);

module.exports = app;
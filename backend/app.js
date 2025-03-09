// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv"; // Move dotenv to the top
// import helmet from "helmet";
// import morgan from "morgan";
// import bodyParser from "body-parser";
// import path from "path";
// import { connectDB } from "./DB/Database.js";
// import transactionRoutes from "./Routers/Transactions.js";
// import userRoutes from "./Routers/userRouter.js";
// // import authRoutes from "./routes/authRoutes.js"; // Adjust path if needed
// // app.use("/api/auth", authRoutes);


// // ✅ Load environment variables at the very beginning
// dotenv.config({ path: "./config/config.env" });

// const PORT = process.env.PORT || 3000;
// const app = express();

// // ✅ Ensure database connection
// connectDB();

// // ✅ Allowed origins for CORS
// const allowedOrigins = [
//   "https://main.d1sj7cd70hlter.amplifyapp.com",
//   "https://expense-tracker-app-three-beryl.vercel.app",
// ];

// // ✅ Middleware
// app.use(express.json());
// app.use(
//   cors({
//     origin: allowedOrigins,
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE"],
//   })
// );
// app.use(helmet());
// app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
// app.use(morgan("dev"));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));

// // ✅ Routers
// app.use("/api/v1", transactionRoutes);
// app.use("/api/auth", userRoutes);

// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });

// // ✅ Start server
// app.listen(PORT, () => {
//   console.log(`Server is listening on http://localhost:${PORT}`);
// });


import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import bodyParser from "body-parser";
import { connectDB } from "./DB/Database.js";
import transactionRoutes from "./Routers/Transactions.js";
import userRoutes from "./Routers/userRouter.js";

// Load environment variables
dotenv.config({ path: "./config/config.env" });

const PORT = process.env.PORT || 3000;
const app = express();

// Ensure database connection
connectDB();

// Allowed origins for CORS
const allowedOrigins = [
  "http://localhost:5001", // Allow local frontend for development
  "http://localhost:3000", // Optional if frontend runs on port 3000
  "https://main.d1sj7cd70hlter.amplifyapp.com",
  "https://expense-tracker-app-three-beryl.vercel.app",
];

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Routers
app.use("/api/v1", transactionRoutes);
app.use("/api/auth", userRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
});

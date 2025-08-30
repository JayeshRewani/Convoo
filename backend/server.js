import dotenv from "dotenv";
dotenv.config({
    path: "./.env"
});
import express, { urlencoded } from "express";
import connectDB from "./src/lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve()

app.use(express.json());
app.use(urlencoded({extended:true}));
app.use(cookieParser());
app.use(cors({
    origin: ["http://localhost:5173","http://localhost:5001"],
    credentials:true,
    methods: ["GET","POST","PUT","DELETE"],
}));
console.log("ENV TEST:", process.env.FRONTEND_URL);




// Routes
import authRoutes from "./src/routes/auth.route.js";
import userRoutes from "./src/routes/user.route.js";
import chatRoutes from "./src/routes/chat.route.js";


app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat",chatRoutes)

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log("Server is running on port ",PORT);
        });
    })
    .catch((err) => {
        console.log("Error connecting to MongoDB",err);
    });

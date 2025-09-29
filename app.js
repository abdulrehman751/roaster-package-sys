import dotenv from "dotenv";
import express from "express";
import connectDB from "./config/db.js"
import productRoutes from "./routes/productRoutes.js";


dotenv.config();
const app=express();

connectDB();
app.use(express.json());








// routes
app.use("/api/products", productRoutes)


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

import express from "express";
import { createProducts,getProducts,updateProducts,deleteProducts } from "../controllers/productController.js";
const router=express.Router();


router.get("/",getProducts)
router.post("/",createProducts)
router.put("/",updateProducts)
router.delete("/",deleteProducts)


export default router;
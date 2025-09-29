import Product from "../models/Product.js";

export const createProducts = async (req, res) => {
  try {
    const {
      title,
      description,
      slug,
      subTitle,
      productDetails,
      descriptionDetails,
      priceBreaks,
      iconDetails,
      FAQs,
      productImages,
     } = req.body;
    const product = await Product.create({
      title,
      description,
      slug,
      subTitle,
      productDetails,
      descriptionDetails,
      priceBreaks,
      iconDetails,
      FAQs,
      productImages,
    });
    return res
      .status(200)
      .json({ message: "product created successfully", product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdat: -1 });
    if (!products)
      return res.status(404).json({ message: "Products not found" });
    res
      .status(200)
      .json({ message: "Products fetch successfully", status: true, products });
  } catch (error) {
    res.status(500).json({ message: err.message, status: "false" });
  }
};
export const updateProducts = async (req, res) => {
  try {
    const products = await Product.findByIdAndUpdate(req.parms.id, req.body, {
      new: true,
    });
    if (!products) {
      return res.status(404).json({ message: "Products not found" });
    } else {
      return res.status(201).json({ message: "Products updated successfully" });
    }
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const deleteProducts = async (req, res) => {
  try {
    const products = await Product.findByIdAndDelete(req.parms.id);
        if (!products) {
      return res.status(404).json({ message: "Products not found" });
    } else {
      return res.status(201).json({ message: "Products deleted successfully" });
    }
  } catch (error) {
    req.status(500).json({message:error.message})
  }
};

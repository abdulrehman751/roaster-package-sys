import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    slug: { type: String, required: true },
    subTitle: { type: String, required: true },
    productDetails: { type: String, required: true },
    descriptionDetails: { type: String, required: true },
    priceBreaks: { type: String },
    iconDetails: [
      {
        iconTitle: { type: String, required: true },
        iconImageUrl: { type: String, required: true },
      },
    ],
    faqs: [
      {
        questions: { type: String, required: true },
        answers: { type: String, required: true },
      },
    ],
    productImages: [{ type: String, required: true }],
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
export default Product;

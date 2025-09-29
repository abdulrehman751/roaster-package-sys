import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    slug: { type: String},
    subTitle: { type: String },
    productDetails: { type: String, required: true },
    descriptionDetails: { type: String, required: true },
    priceBreaks: { type: String },
    iconDetails: [
      {
        iconTitle: { type: String},
        iconImageUrl: { type: String},
      },
    ],
    faqs: [
      {
        questions: { type: String},
        answers: { type: String},
      },
    ],
    productImages: [{ type: String}],
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
export default Product;

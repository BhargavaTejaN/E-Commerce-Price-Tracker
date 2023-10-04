import mongoose, { model, models, Schema } from "mongoose";

// reusable fields
const requiredString = {
  type: String,
  required: true,
};

const requiredNumber = {
  type: Number,
  required: true,
};

const stringAlone = {
  type: String,
};

const numberAlone = {
  type: Number,
};

const dateWithDefault = {
  type: Date,
  default: Date.now,
};

const urlType = {
  type: String,
  required: true,
  unique: true,
};

const BooleonType = {
  type: Boolean,
  default: false,
};

const productSchema = new Schema(
  {
    url: urlType,
    currency: requiredString,
    image: requiredString,
    title: requiredString,
    currentPrice: requiredNumber,
    originalPrice: requiredNumber,
    priceHistory: [
      {
        price: requiredNumber,
        date: dateWithDefault,
      },
    ],
    lowestPrice: numberAlone,
    highestPrice: numberAlone,
    averagePrice: numberAlone,
    discountRate: numberAlone,
    reviewsCount: stringAlone,
    description: stringAlone,
    category: stringAlone,
    stars : stringAlone,
    isOutOfStock: BooleonType,
    users: [
      {
        email: requiredString,
      },
    ],
    default: [],
  },
  { timestamps: true }
);

const Product = models.Product || model("Product", productSchema);
export default Product;

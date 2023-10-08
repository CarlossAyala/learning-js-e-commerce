const express = require("express");
const router = express.Router();
const categories = require("./category/category.routes");
const products = require("./product/product.routes");
const reviews = require("./review/review.routes");
const paymentIntents = require("./payment-intents/payment-intent.routes");
const paymentMethods = require("./payment-methods/payment-method.routes");

router.use("/categories", categories);
router.use("/products", products);
router.use("/reviews", reviews);
router.use("/payment-intents", paymentIntents);
router.use("/payment-methods", paymentMethods);

module.exports = router;

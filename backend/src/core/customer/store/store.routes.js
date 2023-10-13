const express = require("express");
const Boom = require("@hapi/boom");
const router = express.Router();
const { Store, Product } = require("../../../database/mysql/models");
const { slugify, QueryBuilder } = require("../../../libs");
const { validateSchema } = require("../../../middlewares");
const schemas = require("./store.schema");

// Get All
router.get("/", async (req, res, next) => {
  try {
    const stores = await Store.model.findAndCountAll({
      order: [["name", "ASC"]],
      limit: 50,
      offset: 0,
    });

    return res.status(200).json(stores);
  } catch (err) {
    next(err);
  }
});

// Get by slug
router.get("/:name", async (req, res, next) => {
  const { name } = req.params;

  const slug = slugify(name);

  try {
    const store = await Store.model.findOne({
      attributes: {
        exclude: ["userId"],
      },
      where: { slug },
    });

    if (!store) {
      throw Boom.notFound("Store not found");
    }

    return res.status(200).json(store);
  } catch (err) {
    next(err);
  }
});

// Get by productId
router.get(
  "/:id/by-product-id",
  validateSchema(schemas.resourceId, "params"),
  async (req, res, next) => {
    const { id: productId } = req.params;

    try {
      const product = await Product.model.findByPk(productId);
      if (!product) {
        throw Boom.notFound("Product not found");
      }

      const store = await Store.model.findByPk(product.dataValues.storeId);
      if (!store) {
        throw Boom.notFound("Store not found");
      }

      return res.status(200).json(store);
    } catch (err) {
      next(err);
    }
  }
);

// Get Products Store by slug
router.get(
  "/:name/products",
  validateSchema(schemas.resourceName, "params"),
  async (req, res, next) => {
    const { name } = req.params;

    const { limit, offset } = new QueryBuilder(req.query).pagination().build();

    const slug = slugify(name);

    try {
      const store = await Store.model.findOne({
        attributes: {
          exclude: ["userId"],
        },
        where: { slug },
      });
      if (!store) {
        throw Boom.notFound("Store not found");
      }

      const products = await Product.model.findAndCountAll({
        where: { storeId: store.dataValues.id },
        limit,
        offset,
      });

      return res.status(200).json(products);
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;

const db = require("../../../db/mysql/models");
const { NotFound } = require("../../../utils/http-errors");
const QueryBuilder = require("../../../utils/query-builder");

const StoreModel = db.sequelize.model("Store");
const ProductModel = db.sequelize.model("Product");
const ProductImageModel = db.sequelize.model("ProductImage");
const StoreImageModel = db.sequelize.model("StoreImage");

const findAll = async (req, res, next) => {
  const qb = new QueryBuilder(req.query)
    .whereLike("name", req.query.q)
    .orderBy("name", "ASC")
    .pagination()
    .build();

  try {
    const stores = await StoreModel.findAndCountAll(qb);

    res.json(stores);
  } catch (error) {
    next(error);
  }
};

const findOne = async (req, res, next) => {
  const { storeId } = req.params;

  try {
    const store = await StoreModel.findByPk(storeId, {
      raw: true,
    });
    if (!store) {
      throw new NotFound("Store not found");
    }

    const gallery = await StoreImageModel.findAll({
      where: {
        storeId,
      },
      order: [["order", "ASC"]],
    });
    store.gallery = gallery;

    res.json(store);
  } catch (error) {
    next(error);
  }
};

const findByProductId = async (req, res, next) => {
  const { productId } = req.params;

  try {
    const product = await ProductModel.findByPk(productId);
    if (!product) {
      throw new NotFound("Product not found");
    }

    const store = await StoreModel.findByPk(product.dataValues.storeId);
    if (!store) {
      throw new NotFound("Store not found");
    }

    res.json(store);
  } catch (error) {
    next(error);
  }
};

const findProducts = async (req, res, next) => {
  const { storeId } = req.params;

  const qb = new QueryBuilder(req.query)
    .where("storeId", storeId)
    .whereLike("name", req.query.q)
    .pagination()
    .build();

  try {
    const store = await StoreModel.findByPk(storeId);
    if (!store) {
      throw new NotFound("Store not found");
    }

    const products = await ProductModel.findAndCountAll({
      ...qb,
      include: {
        model: ProductImageModel,
        as: "gallery",
        required: false,
        order: [["order", "ASC"]],
        separate: true,
      },
    });

    res.json(products);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  findAll,
  findOne,
  findByProductId,
  findProducts,
};

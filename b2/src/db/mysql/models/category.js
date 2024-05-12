"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // Category.hasMany(models.Category, {
      //   foreignKey: "parentId",
      //   as: "children",
      // });
      // Category.belongsTo(models.Category, {
      //   foreignKey: "parentId",
      //   as: "parent",
      // });
      // Category.hasMany(models.CategoryGallery, {
      //   foreignKey: "categoryId",
      //   as: "gallery",
      // });
      // Category.hasMany(models.Product, {
      //   foreignKey: "categoryId",
      //   as: "products",
      // });
    }
  }
  Category.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: DataTypes.STRING,
      description: DataTypes.STRING,
      image: DataTypes.STRING,
      slug: {
        type: DataTypes.STRING,
        unique: "slug",
      },
    },
    {
      sequelize,
      modelName: "Category",
    }
  );
  return Category;
};

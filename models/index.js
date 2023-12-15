// import models
const Product = require('./Product');
const Category = require('./Category');
const Tag = require('./Tag');
const ProductTag = require('./ProductTag');

// Products belongsTo Category
Product.belongsTo(Category, {
  foreignKey: 'category_id',
  onDelete: 'CASCADE' //i think
});

// Categories have many Products
Category.hasMany(Product, {
  foreignKey: 'category_id', //dont know
});

// Products belongToMany Tags (through ProductTag)
Product.belongsToMany(Tag, {
  through: ProductTag //is this the through done properly
  
});

// Tags belongToMany Products (through ProductTag)
Tag.belongsToMany(Product, {
  through: ProductTag // same as line 24 comment
});

module.exports = {
  Product,
  Category,
  Tag,
  ProductTag,
};

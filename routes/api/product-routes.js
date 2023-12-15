const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');
const { sync } = require('../../models/Product');

// The `/api/products` endpoint

// get all products
// find all products
// be sure to include its associated Category and Tag data
router.get('/', async (req, res) => {
  try {
    const products = await Product.findAll({
     include: [
      { model: Category }, 
      { model: Tag } 
    ]
    })
    res.send(products)
   } catch (err) {
     res.status(500).json(err)
   }
});

// get one product
// find a single product by its `id`
// be sure to include its associated Category and Tag data
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
       include: [
        { model: Category },
        { model: Tag }
      ]
     });
 
     if (!product) {
       res.status(404).json({ message: 'No product found with that id!' });
       return;
     }
 
     res.send(product);
   } catch (err) {
     res.status(500).json(err);
   }
});

// create new product
router.post('/', async (req, res) => {
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */
  try {
    const newProduct = await Product.create({
      ...req.body
    })

     // if there's product tags, we need to create pairings to bulk create in the ProductTag model
     if (req.body.tagIds.length) {
      const productTagIdArr = req.body.tagIds.map((tag_id) => {
        return {
          product_id: newProduct.id,
          tag_id,
        };
      });
      return ProductTag.bulkCreate(productTagIdArr);
    }
    res.status(200).json(newProduct);
    res.send(newProduct)
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
 }
});

// update product
router.put('/:id', async (req, res) => {
  // update product data
  try {
    const productData = await Product.update(req.body, {
      where: {
        id: req.params.id
      }
    })

    if (req.body.tagIds && req.body.tagIds.length) {
      const productTags = await ProductTag.findAll({
        where: { product_id: req.params.id }
      })
      // create filtered list of new tag_ids
      const productTagIds = productTags.map(({ tag_id }) => tag_id);
      const newProductTags = req.body.tagIds
      .filter((tag_id) => !productTagIds.includes(tag_id))
      .map((tag_id) => {
        return {
          product_id: req.params.id,
          tag_id,
        };
      });

      // figure out which ones to remove
      const productTagsToRemove = productTags
      .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
      .map(({ id }) => id);

      // run both actions
      return([
        await ProductTag.destroy({ where: { id: productTagsToRemove } }),
        await ProductTag.bulkCreate(newProductTags),
      ])
    }
    
    res.send({ message: 'successfuly updated'});

  } catch (err) {
    console.log(err)
    res.status(500).json(err);
  }
});

// delete one product by its `id` value
router.delete('/:id', async (req, res) => {
  try {
    const productData = await Product.destroy({
      where: {
        id: req.params.id,
      }
    });
    if (!productData) {
      res.status(404).json({ message: 'No product found with that id!' });
      return;
    }
    res.status(200).json(productData);
    res.send({ message: 'successfully deleted'})
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;

const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

// find all categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.findAll({
      include: [{model: Product}]
    });

    res.send(categories);

  } catch (err) {
      console.log(err);
      res.status(500).json(err);
  }
});

// find one category by its `id` value
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id, {
      include: [{model: Product }]
    });

    if (!category) {
      res.status(404).json({ message: 'No category found with that id!' });
      return;
    };

    res.send(category);

  } catch (err) {
      console.log(err);
      res.status(500).json(err);
  }
});

// create a new category
router.post('/new', async (req, res) => {
  try {
    const newCategory = await Category.create({
      category_name: req.body.category_name
    });

    res.status(200).json(newCategory);

  } catch (err) {
      console.log(err);
      res.status(400).json(err);
  }
});

// update a category by its `id` value
router.put('/:id', async (req, res) => {
  try{
    const categoryData = await Category.update({
      category_name: req.body.category_name,
    },
    {
      where: {
        id: req.params.id,
      }
    });

    if (!categoryData) {
      res.status(404).json({ message: 'No category found with that id!' });
      return;
    };

    res.send({ message: 'successfuly updated'});

  } catch (err) {
      console.log(err)
      res.status(500).json(err);
  }
});

// delete a category by its `id` value
router.delete('/:id', async (req, res) => {
  try {
    const categoryData = await Category.destroy({
      where: {
        id: req.params.id,
      }
    });

    if (!categoryData) {
      res.status(404).json({ message: 'No category found with that id!' });
      return;
    };

    res.send({ message: 'successfully deleted'});

  } catch (err) {
      console.log(err);
      res.status(500).json(err);
  }
});

module.exports = router;

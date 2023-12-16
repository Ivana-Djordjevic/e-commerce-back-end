const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

// find all tags
router.get('/', async (req, res) => {
  try {
    const tags = await Tag.findAll({
      include: [{model: Product}]
    });

    res.send(tags);

  } catch (err) {
      console.log(err);
      res.status(500).json(err);
  }
});

// find a single tag by its `id`
router.get('/:id', async (req, res) => {
  try {
    const tag = await Tag.findByPk(req.params.id, {
       include: [{model: Product }]
     });
 
    if (!tag) {
       res.status(404).json({ message: 'No tag found with that id!' });
       return;
     };
 
    res.send(tag);

  } catch (err) {
      console.log(err);
      res.status(500).json(err);
  }
});

// create a new tag
router.post('/', async (req, res) => {
  try {
    const newTag = await Tag.create({
      tag_name: req.body.tag_name
    });

    res.status(200).json(newTag);

  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

// update a tag's name by its `id` value
router.put('/:id', async (req, res) => {
  try {
    const tagData = await Tag.update({
      tag_name: req.body.tag_name,
    },
    {
      where: {
        id: req.params.id,
      }
    });

    if (!tagData) {
      res.status(404).json({ message: 'No tag found with that id!' });
      return;
    };

    res.send({ message: 'successfuly updated'});

  } catch (err) {
      console.log(err);
      res.status(500).json(err);
  }
});

// delete on tag by its `id` value
router.delete('/:id', async (req, res) => {
  try {
    const tagData = await Tag.destroy({
      where: {
        id: req.params.id,
      }
    });

    if (!tagData) {
      res.status(404).json({ message: 'No tag found with that id!' });
      return;
    };

    res.send({ message: 'successfully deleted'});

  } catch (err) {
      console.log(err);
      res.status(500).json(err);
  }
});

module.exports = router;

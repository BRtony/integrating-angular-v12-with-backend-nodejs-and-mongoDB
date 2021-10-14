var express = require('express');
var router = express.Router();
var Product = require('./product.js');


router.post('/', function (req, res) {
  console.log(req.body);
  p = new Product({
    name: req.body.name,
    price: req.body.price,
    stock: req.body.stock,
    departments : req.body.departments, //map((d) => d.id)
  });
  p.save((err, prod) => {
    if (err) 
      res.status(500).send(err);
    else
      res.status(200).send(prod);
  });
})

router.get('/', function (req, res) {
  Product.find().exec(
    (err, prods) => {
      if (err)
        res.status(500).send(err);
      else
        res.status(200).send(prods);
    }
  );
})

router.delete('/:id', function (req, res) {
  Product.deleteOne({_id: req.params.id},
    (err) => {
      if (err)
        res.status(500).send(err);
      else
        res.status(200).send({});
    }
  );
})

router.patch('/:id', function (req, res) {
  console.log(req.body);
  Product.findById(req.params.id, 
    (err, prod) => {
      if (err) 
        res.status(404).send(err);
      else {
        prod.name = req.body.name;
        prod.price = req.body.price;
        prod.stock = req.body.stock;
        prod.departments = req.body.departments, //.map((d) => d.id);
        console.log(prod);
        prod.save((err,prod) => {
          if (err) {
            console.log(err);
            res.status(500).send(err);
          }
          else
            res.status(200).send(prod);
        });
      }
    }); 
})


module.exports = router;

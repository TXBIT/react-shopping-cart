const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const shortid = require('shortid');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use('/', express.static(__dirname + '/build'));
app.get('/', (req, res) => res.sendFile(__dirname + '/build/index.html'));

mongoose.connect(
  process.env.MONGODB_URL || `mongodb://localhost:27017/react-shopping-cart-db`,
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  }
);

const Product = mongoose.model(
  'Product',
  new mongoose.Schema({
    _id: {
      type: String,
      default: shortid.generate,
    },
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    image: {
      type: String,
    },
    price: {
      type: Number,
    },
    availableSizes: {
      type: [String],
    },
  })
);

const Order = mongoose.model(
  'Order',
  new mongoose.Schema(
    {
      _id: {
        type: String,
        default: shortid.generate,
      },
      email: {
        type: String,
      },
      name: {
        type: String,
      },
      address: {
        type: String,
      },
      total: {
        type: Number,
      },
      cartItems: [
        {
          _id: String,
          title: String,
          price: Number,
          count: Number,
        },
      ],
    },
    {
      timestamps: true,
    }
  )
);

app.get('/api/products', async (req, res) => {
  const products = await Product.find({});
  res.send(products);
});

app.post('/api/products', async (req, res) => {
  // const newProduct = new Product(req.body);
  // const savedProduct = await newProduct.save();
  const savedProduct = await Product(req.body).save();
  res.send(savedProduct);
});

app.delete('/api/products/:id', async (req, res) => {
  const deleteProduct = await Product.findByIdAndDelete(req.params.id);
  res.send(deleteProduct);
});

app.get('/api/orders', async (req, res) => {
  const orders = await Order.find({});
  res.send(orders);
});

app.post('/api/orders', async (req, res) => {
  if (
    !req.body.name ||
    !req.body.email ||
    !req.body.address ||
    !req.body.total ||
    !req.body.cartItems
  ) {
    return res.send({ message: 'Data is required.' });
  }

  const order = await Order(req.body).save();
  res.send(order);
});

app.delete('/api/orders/:id', async (req, res) => {
  const order = await Order.findByIdAndDelete(req.params.id);
  res.send(order);
});

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server at http://localhost:${port}`));

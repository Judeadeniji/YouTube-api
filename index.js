//index.js

const express = require('express');
const cors = require("cors");
const path = require("path");

const rateLimit = require('./src/middlewares/limit-requests');
const mediaRoutes = require('./src/routes/mediaRoutes');
const requestRoutes = require('./src/routes/requestRoutes');


const app = express();
const port = 3000;
const indexPath = path.join(__dirname, "src","public", "index.html");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get('/', (req, res) => {
  res.sendFile(indexPath);
});
app.use('/media', rateLimit(), mediaRoutes);
app.use('/v1', rateLimit(), requestRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

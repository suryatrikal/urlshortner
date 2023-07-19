const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const UrlMap = require('./models/model');
const path = require('path');
require('dotenv').config();

const app = express()
const PORT = process.env.PORT || 8000
const MONGO_URL = process.env.MONGO_URL

app.use(express.json());
app.use(cors())
// app.use(express.static(`${__dirname}../public`));
app.use(express.static(path.join(__dirname, '..', "client", "build")))


app.post('/createUrl', async (req, res) => {
  const oldUrl = req.body.url;
  let Id = new Date().getUTCMilliseconds().toString() + (Math.random() * 100).toFixed().toString()
  // console.log(Id);
  let newUrl = `http://localhost:8000/${Id}`
  try {
    await UrlMap.updateOne({
      oldUrl: oldUrl
    }, {
      oldUrl: oldUrl,
      newUrl: newUrl,
    }, {
      upsert: true,
    });
    res.status(200).json({ newUrl: newUrl });
  } catch (error) {
    res.status(500).json({ error: error });
  }
})

app.get('/:id', async (req, res) => {
  try {
    const data = await UrlMap.findOne({
      newUrl: `http://localhost:8000/${req.params.id}`
    })
    res.redirect(data.oldUrl)
  } catch (error) {
    res.status(500).json({ error: error });
  }
})

mongoose.connection.once('open', () => console.log('connected successfully'))
mongoose.connection.on('error', (err) => console.log(err))

mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  // useFindAndModify: false,
  useUnifiedTopology: true,
  // useCreateIndex: true,
})

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, '..', "client", "build", "index.html"));
});

app.listen(PORT, () => {
  console.log('listening on PORT 8000...');
})
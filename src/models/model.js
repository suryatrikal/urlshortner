const mongoose = require("mongoose");

const UrlMapSchema = new mongoose.Schema({
  oldUrl: {
    type: String,
    required: true,
  },
  newUrl: {
    type: String,
    required: true,
  },
});

const UrlMap = mongoose.model("UrlMap", UrlMapSchema);

module.exports = UrlMap;
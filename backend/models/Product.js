const mongoose = require("mongoose");
const productSchema = new mongoose.Schema({
storeId: {
type: mongoose.Schema.Types.ObjectId,
ref: "Store",
},
name: {
type: String,
required: true,
},
description: {
type: String,
},
price: {
type: Number,
required: true,
},
stock: {
type: Number,
default: 0,
},
category: {
type: String,
},
images: {
type: [String],
},
sizes: {
type: [String],
},
colors: {
type: [String],
},
rating: {
type: Number,
default: 0,
},
});
module.exports = mongoose.model("Product", productSchema);
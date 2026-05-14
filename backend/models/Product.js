const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
storeId: {
type: mongoose.Schema.Types.ObjectId,
ref: "Store",
required: true,
},
name: {
type: String,
required: true,
},
description: {
type: String,
required: true,
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
required: true,
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
}, {
timestamps: true
});

module.exports = mongoose.model("Product", productSchema);
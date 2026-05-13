const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
userId: {
type: mongoose.Schema.Types.ObjectId,
ref: "User",
required: true,
},
productId: {
type: mongoose.Schema.Types.ObjectId,
ref: "Product",
required: true,
},
rating: {
type: Number,
required: true,
default: 0,
},
comment: {
type: String,
required: true,
},
images: {
type: [String],
},
}, {
timestamps: true
});

module.exports = mongoose.model("Review", reviewSchema);
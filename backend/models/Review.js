const mongoose = require("mongoose");
const reviewSchema = new mongoose.Schema({
userId: {
type: mongoose.Schema.Types.ObjectId,
ref: "User",
},
productId: {
type: mongoose.Schema.Types.ObjectId,
ref: "Product",
},
rating: {
type: Number,
},
comment: {
type: String,
},
images: {
type: [String],
},
});
module.exports = mongoose.model("Review", reviewSchema);
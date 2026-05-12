const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema({
userId: {
type: mongoose.Schema.Types.ObjectId,
ref: "User",
},
totalAmount: {
type: Number,
},
status: {
type: String,
enum: ["PROCESSING", "SHIPPED", "DELIVERED"],
default: "PROCESSING",
},
deliveryAddress: {
type: String,
},
});
module.exports = mongoose.model("Order", orderSchema);
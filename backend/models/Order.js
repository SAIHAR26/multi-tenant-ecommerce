const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
userId: {
type: mongoose.Schema.Types.ObjectId,
ref: "User",
required: true,
},
totalAmount: {
type: Number,
required: true,
},
status: {
type: String,
enum: ["PROCESSING", "SHIPPED", "DELIVERED"],
default: "PROCESSING",
},
deliveryAddress: {
type: String,
required: true,
},
}, {
timestamps: true
});

module.exports = mongoose.model("Order", orderSchema);
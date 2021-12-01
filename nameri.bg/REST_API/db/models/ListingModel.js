const mongoose = require("mongoose")

const ListingSchema = new mongoose.Schema({
    heading: { type: String, required: true },
    prices: [{ type: String }],
    images: [{ type: String }],
    mainImg: { type: String },
    tags: [{ type: String }],
    premiumType: { type: Boolean, required: true, default: false },
    reviews: [{ type: String, ref: "Review", required: true, default: [] }],
    rating: { type: Number, required: true, default: 0 },
    details: { type: String },
    city: { type: String, required: true },
    user: {
        type: String,
        ref: "User",
        required: true,
    },
    timeCreated: { type: Date, required: true, default: Date.now },
})

const ListingModel = mongoose.model("Listing", ListingSchema)

module.exports = ListingModel
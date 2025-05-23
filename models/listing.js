const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    type: String,
    default:
      "https://unsplash.com/photos/a-lighthouse-stands-on-a-sandy-beach-PVeR1AyEyNY",
    set: (v) =>
      v === ""
        ? "https://unsplash.com/photos/a-lighthouse-stands-on-a-sandy-beach-PVeR1AyEyNY"
        : v,
  },
  price: Number,
  location: String,
  country: String,
  reviews: [
    {
      type : Schema.Types.ObjectId,
      ref: "Review",
    }
  ]
});

const Listing = mongoose.model("listing", listingSchema);
module.exports = Listing;

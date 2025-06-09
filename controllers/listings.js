const Listing = require("../models/listing.js");
const { listingSchema } = require("../schema.js");
const geocode = require("../utils/geocode");
const { sampleListings } = require("../init/data.js");

const fetchHotelList = require("../utils/api");
const airbnbHotelList = require("../utils/airbnbApi"); // adjust path as needed

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing you requested does not exist!");
    res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res, next) => {
  const geoData = await geocode(req.body.listing.location);
  if (!geoData) {
    req.flash("error", "Location could not be geocoded");
    return res.redirect("/listings/new");
  }
  let url = req.file.path;
  let filename = req.file.filename;
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  newListing.geometry = geoData; // <- Save coordinates
  await newListing.save();
  req.flash("success", "New Listing Created");
  res.redirect("/listings");
};
























module.exports.createMultipleListings = async (req, res, next) => {
   try {
    let listingsData = await airbnbHotelList(); // assuming it returns an array of hotel/listing objects
    let data = listingsData.data.list;
    console.log(data);
    const ownerId = req.user._id; // assuming user is authenticated

    for (let i = 0; i < data.length; i++) {
      let listing = data[i].listing;
      let priceString = data[i].structuredDisplayPrice.primaryLine.price ;
let price = parseInt(priceString.replace(/\$/g, ""), 10) * 85.44;


      const newListing = new Listing({
        title: listing.title,                                      
        description: listing.legacyName|| "No description provided.",
        location: listing.legacyCity,
        price: price || 1,
        owner: ownerId,
        image: {
          url: data[i].contextualPictures[0].picture || "default.jpg",
          filename: "placeholder",
        },
       geometry: {
  type: "Point",
  coordinates: [listing.legacyCoordinate.longitude, listing.legacyCoordinate.latitude]
}

      });

      await newListing.save();
    }

    req.flash("success", "Multiple listings created successfully.");
    res.redirect("/listings");
  } catch (err) {
    console.error("Error creating multiple listings:", err);
    req.flash("error", "Failed to create listings.");
    res.redirect("/listings/new");

  }






































  for (let i = 0; i < sampleListings.length; i++) {
    const sampleData = sampleListings[i];
    const ownerId = req.user._id;
    const geoData = await geocode(sampleData.location); // assuming each item has a 'location' field
    if (!geoData) {
      console.log(`Skipping ${sampleData.name} - invalid location`);
      continue;
    }
    const newListing = new Listing({
      title: sampleData.title,
      description: sampleData.description,
      location: sampleData.location,
      price: sampleData.price || 1,
      owner: ownerId,
      image: {
        url: sampleData.image.url,
        filename: sampleData.image.filename,
      },
      geometry: geoData,
    });
    await newListing.save();
  }
  try {
    const listingsData = await fetchHotelList(); // assuming it returns an array of hotel/listing objects

    const ownerId = req.user._id; // assuming user is authenticated

    for (let i = 0; i < 30; i++) {
      let data = listingsData.data[i];
      const geoData = await geocode(listingsData.data[i].location_string); // assuming each item has a 'location' field
      if (!geoData) {
        console.log(`Skipping ${data.name} - invalid location`);
        continue;
      }

      const [minStr, maxStr] = data.price.replace(/\$/g, "").split(" - ");

      // Convert to numbers
      const min = parseInt(minStr, 10);
      const max = parseInt(maxStr, 10);

      // Calculate average
      const avgPrice = Math.round((min + max) / 2) * 85.66;

      const newListing = new Listing({
        title: data.name,
        description: data.ranking || "No description provided.",
        location: data.location_string,
        price: avgPrice || 1,
        owner: ownerId,
        image: {
          url: data.photo.images.original.url || "default.jpg",
          filename: "placeholder",
        },
        geometry: geoData,
      });

      await newListing.save();
    }

    req.flash("success", "Multiple listings created successfully.");
    res.redirect("/listings");
  } catch (err) {
    console.error("Error creating multiple listings:", err);
    req.flash("error", "Failed to create listings.");
    res.redirect("/listings/new");
  }
};

module.exports.editListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested does not exist!");
    res.redirect("/listings");
  }
  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_300,w_250");
  res.render("listings/edit.ejs", { listing, originalImageUrl });
};
module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }
  req.flash("success", "Listing Updated");
  res.redirect(`/listings/${id}`);
};
module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success", " Listing Deleted");
  res.redirect("/listings");
};

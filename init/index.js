const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const data = require("./data.js");

let DB_address = "mongodb://127.0.0.1:27017/wanderlust";
async function main() {
  await mongoose.connect(DB_address);
}
main()
  .then((res) => {
    console.log("connected to DB successfully");
  })
  .catch((err) => {
    console.log(err);
  });

async function init() {
  await Listing.deleteMany({});
  data.data = data.data.map((obj) => ({
    ...obj,
    owner: "693d03ac0fec82fe834dceca",
  }));
  await Listing.insertMany(data.data);
}

init();

const joi = require("joi");

module.exports.listingSchema = joi.object({
  listing: joi
    .object({
      title: joi.string().required(),
      description: joi.string().required(),
      price: joi.number().required().min(0),
      image: joi
        .object({
          // The client will send the URL via listing[image][url]
          url: joi.string().allow("").optional(),
          filename: joi.string().allow("").optional(),
        })
        .optional(), // The image object itself is optional for updates
      location: joi.string().required(),
      country: joi.string().required(),
    })
    .required(),
});
// schema validaton for server

//schema validation for review
module.exports.reviewSchema = joi.object({
  review: joi
    .object({
      rating: joi.number().required().min(0).max(5),
      comment: joi.string().required(),
    })
    .required(),
});

const express = require("express");
const router = express.Router();

const {
  validationRules,
  productAvailabilityController,
} = require("./controllers/productAvailability");
const validate = require("./middleware/validate");

router.get(
  "/availability",
  validationRules,
  validate,
  productAvailabilityController
);

module.exports = router;

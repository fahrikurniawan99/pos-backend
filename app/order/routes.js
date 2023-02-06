const { police_check, decodeToken } = require("../../middlewares");
const controller = require("./controller");

const router = require("express").Router();

router.post(
  "/orders",
  decodeToken(),
  police_check("create", "Order"),
  controller.store
);
router.get("/orders",decodeToken(), police_check("view", "Order"), controller.index);

module.exports = router;

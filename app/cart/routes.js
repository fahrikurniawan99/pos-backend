const router = require("express").Router();
const { police_check, decodeToken } = require("../../middlewares");
const controller = require("./controller");

router.put(
  "/carts",
  decodeToken(),
  police_check("update", "Cart"),
  controller.update
);
router.get(
  "/carts",
  decodeToken(),
  police_check("read", "Cart"),
  controller.index
);

module.exports = router;

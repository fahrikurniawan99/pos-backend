const { decode } = require("jsonwebtoken");
const { police_check, decodeToken } = require("../../middlewares");
const controller = require("./controller");
const router = require("express").Router();

router.post(
  "/delivery-addresses",
  decodeToken(),
  police_check("create", "DeliveryAddress"),
  controller.store
);
router.get(
  "/delivery-addresses",
  decodeToken(),
  police_check("view", "DeliveryAddress"),
  controller.index
);
router.put(
  "/delivery-addresses/:id",
  decodeToken(),
  police_check("update", "DeliveryAddress"),
  controller.update
);
router.delete(
  "/delivery-addresses/:id",
  decodeToken(),
  police_check("delete", "DeliveryAddress"),
  controller.destroy
);

module.exports = router;

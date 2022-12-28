const { police_check } = require("../../middlewares");
const controller = require("./controller");
const router = require("express").Router();

router.post(
  "/delivery-addresses",
  police_check("create", "DeliveryAddress"),
  controller.store
);
router.get(
  "/delivery-addresses",
  police_check("view", "DeliveryAddress"),
  controller.index
);
router.put("/delivery-addresses/:id", controller.update);
router.delete(
  "/delivery-addresses/:id",
  police_check("delete", "DeliveryAddress"),
  controller.destroy
);

module.exports = router;

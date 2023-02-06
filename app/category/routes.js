const router = require("express").Router();
const { police_check, decodeToken } = require("../../middlewares");
const controller = require("./controller");

router.post(
  "/categories",
  decodeToken(),
  police_check("create", "Category"),
  controller.store
);
router.get("/categories", controller.index);
router.put(
  "/categories/:id",
  decodeToken(),
  police_check("update", "Category"),
  controller.update
);
router.delete(
  "/categories/:id",
  decodeToken(),
  police_check("delete", "Category"),
  controller.destroy
);

module.exports = router;

const router = require("express").Router();
const controller = require("./controller");
const multer = require("multer");
const os = require("os");
const { police_check, decodeToken } = require("../../middlewares");

router.post(
  "/products",
  multer({ dest: os.tmpdir() }).single("image"),
  decodeToken(),
  police_check("create", "Product"),
  controller.store
);
router.get("/products", controller.index);
router.put(
  "/products/:id",
  multer({ dest: os.tmpdir() }).single("image"),
  decodeToken(),
  police_check("update", "Product"),
  controller.update
);
router.delete(
  "/products/:id",
  decodeToken(),
  police_check("delete", "Product"),
  controller.destroy
);

module.exports = router;

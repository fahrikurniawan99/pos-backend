const router = require("express").Router();
const { police_check } = require("../../middlewares");
const controller = require("./controller");

router.put("/carts", police_check("update", "Cart"), controller.update);
router.get("/carts", police_check("read", "Cart"), controller.index);

module.exports = router;

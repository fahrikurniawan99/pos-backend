const { police_check } = require("../../middlewares");
const controller = require("./controller");

const router = require("express").Router();

router.post("/orders", police_check("create", "Order"), controller.store);
router.get("/orders", police_check("view", "Order"), controller.index);

module.exports = router;

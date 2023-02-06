const router = require("express").Router();
const { decodeToken } = require("../../middlewares");
const controller = require("./controller");

router.get("/invoices/:order_id", decodeToken(), controller.index);

module.exports = router;

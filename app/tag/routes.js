const router = require("express").Router();
const { police_check, decodeToken } = require("../../middlewares");
const controller = require("./controller");

router.post("/tags",decodeToken(), police_check("create", "Tag"), controller.store);
router.get("/tags", controller.index);
router.put("/tags/:id",decodeToken(), police_check("update", "Tag"), controller.update);
router.delete("/tags/:id",decodeToken(), police_check("delete", "Tag"), controller.destroy);

module.exports = router;

const router = require("express").Router();
const { police_check } = require("../../middlewares");
const controller = require("./controller");

router.post("/tags", police_check("create", "Tag"), controller.store);
router.get("/tags", controller.index);
router.put("/tags/:id", police_check("update", "Tag"), controller.update);
router.delete("/tags/:id", police_check("delete", "Tag"), controller.destroy);

module.exports = router;

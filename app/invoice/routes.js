const router = require("express").Router()
const controller = require('./controller')

router.get("/invoices/:order_id", controller.index)

module.exports = router
const { subject } = require("@casl/ability");
const { policyFor } = require("../../utils");
const Invoice = require("../invoice/model");

const index = async (req, res, next) => {
  try {
    const invoice = await Invoice.findOne({
      order: req.params.order_id,
    })
      .populate("order")
      .populate("user");
    const policy = policyFor(req.user);
    const subjectInvoice = subject("Invoice", { user_id: invoice.user._id });
    if (!policy.can("read", subjectInvoice))
      return res.status(401).json({
        error: 1,
        message: "anda tidak memiliki akses untuk melihat invoice ini",
      });

    res.status(200).json(invoice);
  } catch (error) {
    res.status(500).json({ error: 1, message: "Error when getting invoice" });
  }
};

module.exports = { index };

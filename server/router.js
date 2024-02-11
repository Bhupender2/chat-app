const express = require("express");
const router = express.Router(); // immediately calling it

router.get("/", (req, res) => {
  res.send("server is up and running ");
});

module.exports = router;  // we are exporting our router here

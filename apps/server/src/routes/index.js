const { Router } = require("express");
const v1Routes = require("./v1");

const router = Router();

router.get("/", (_req, res) => {
  res.json({
    success: true,
    data: {
      name: "Ethara AI API",
      tagline: "Mission Control for AI Teams",
      version: "1.0.0",
    },
  });
});

router.use(v1Routes);

module.exports = router;

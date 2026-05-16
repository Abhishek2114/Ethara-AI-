const express = require("express");
const { constants } = require("./config");
const apiRoutes = require("./routes");
const {
  applySecurityMiddleware,
  notFoundHandler,
  errorHandler,
} = require("./middleware");

const app = express();

applySecurityMiddleware(app);

app.use(constants.API_PREFIX, apiRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;

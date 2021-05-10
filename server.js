const express = require("express");
const logger = require("tracer").colorConsole();
const authentication = require("./src/routers/authenticationRouter.js");
const studenthome = require("./src/routers/studenthomeRouter.js");
const meals = require("./src/routers/mealsRouter.js");

const app = express();
app.use(express.json())
const port = process.env.PORT || 3000;

// Authenticatie | UC-101 t/m UC-103
app.use("/api", authentication);
// Meals | UC-301 t/m UC-305
app.use("/api/studenthome", meals)
// Studenthome | UC-201 t/m UC-206
app.use("/api/studenthome", studenthome)

// Generic handler
app.all( "*", (req, res, next) => {
    logger.debug("Generic logging handler called");
    next();
  },
  (req, res, next) => {
    const reqMethod = req.method;
    const reqUrl = req.url;
    logger.debug(reqMethod + " request at " + reqUrl);
    next();
  }
);

// Catch all endpoint
app.all("*", (req, res, next) => {
  logger.debug("Catch-all endpoint aangeroepen");
  next({ message: "Endpoint '" + req.url + "' does not exist", errCode: 401 });
});

// Error handler
app.use((error, req, res, next) => {
  logger.error("Errorhandler called! ", error);
  res.status(error.errCode).json({
    error: "Some error occurred",
    message: error.message,
  });
});

app.listen(port, () => {
  logger.log(`Example app listening at http://localhost:${port}`);
});

module.exports = app;
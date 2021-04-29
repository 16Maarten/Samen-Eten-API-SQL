const logger = require('tracer').colorConsole();

let result = {
  Student: "Maarten de Zwart",
  Studentnummer: 2176137,
  Description: "Ik ben een student op Avans",
};

let controller = {

  // UC-103 Systeeminfo opvragen
    getInfo(req, res) {
      logger.info("Info endpoint called"); 
      res.status(200).send(result);
    },
  };
  
module.exports = controller;

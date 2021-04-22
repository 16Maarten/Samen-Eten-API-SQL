const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
let result = {
  Student: "Maarten de Zwart",
  Studentnummer: 2176137,
  Description: "Ik ben een student op Avans",
};

app.get("/api/info", (req, res) => {
  res.status(200).json(result).end();
});
app.listen(port, () => {
  console.log(`Server running at http://:${port}/`);
});

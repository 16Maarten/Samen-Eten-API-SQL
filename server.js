const express = require('express')
const app = express()
const port = process.env.PORT || 3000

app.get('/', (req, res) => {

    res.status(200).json('Helllo world!').end()

})
    let result = {
        "response": "hi",
        "status": "ok", }
app.listen(port, () => {
    console.log(result)
})
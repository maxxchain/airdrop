const express = require('express')
const { claimTokens, getBalance } = require('./helper')
const app = express()
const port = 3001

app.post('/claim', async (req, res) => {
    const result = await claimTokens(req.body.userAddress)
    res.send(result);
})

app.get('/getbalance', async (req, res) => {
    const result = await getBalance(req.body.userAddress)
    res.send(result);
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
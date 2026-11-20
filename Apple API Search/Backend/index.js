// Importing the required modules
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser")
const axios = require('axios');
const jwt = require("jsonwebtoken")
const {VerifyToken} = require("./VerifyToken.js")

// Create an instance of the express server
const app = express();
app.use(cors());
app.use(bodyParser.json())

// Define the port number for the server
const PORT = process.env.PORT || 8000;

// Enable Cross-Origin Resource Sharing

app.post("/api/Itunes", VerifyToken, async (req, res) => {
    const newSearch = req.body
        fetch(`https://itunes.apple.com/search?term=${newSearch.Search}&media=${newSearch.Media}`)
            .then(res => res.json())
            .then(data => res.send(data))
            .catch(error => res.status(403).json({message: error}))

});

app.get("/api/getToken", async (req, res) => {
  const payload = {
    name: "user"
  }

  const token = jwt.sign(JSON.stringify(payload), "apiSender", {
    algorithm: "HS256",
  })

  res.send({token: token})
})




// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
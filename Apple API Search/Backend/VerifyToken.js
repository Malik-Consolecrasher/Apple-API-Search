const jwt = require("jsonwebtoken")

function VerifyToken(req, res, next){


  try{

    
  const token = req.headers['authorization']
  const tokenExtract = token.split(' ')[1]

    const payload = jwt.verify(tokenExtract, "apiSender")

    req.payload = payload;
    next()
  }
  catch (error){
    res.status(403).json({message: "Invalid token sent"})
  }
}

module.exports = {
  VerifyToken
}
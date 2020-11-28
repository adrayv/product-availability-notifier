require("dotenv").config();

module.exports = (req, res, next) => {
  const { secret } = req.headers;
  if (secret !== process.env.SECRET) {
    console.log("REQ REJECTED - HEADERS", req.headers);
    return res.status(403).send("Permission Denied");
  }
  next();
};

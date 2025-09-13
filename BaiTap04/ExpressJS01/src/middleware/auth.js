require("dotenv").config();
const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const white_lists = ["/", "/register", "/login"];
  if (white_lists.find((item) => `/v1/api` + item === req.originalUrl)) {
    next();
  } else {
    if (req.headers.authorization?.split(" ")[0] === "Bearer") {
      const token = req.headers.authorization.split(" ")[1];
      // verify token
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = {
          email: decoded.email,
          name: decoded.name,
          createdBy: "Hoidanit",
        };
        console.log(">>> check token: ", decoded);
        next();
      } catch (e) {
        return res.status(401).json({
          message: "Token bị hết hạn/Không hợp lệ",
        });
      }
    } else {
      return res.status(401).json({
        message: "Bạn chưa truyền Access Token ở header/Hoặc token bị hết hạn",
      });
    }
  }
};

module.exports = auth;

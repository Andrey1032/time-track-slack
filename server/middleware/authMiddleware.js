const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
    const token = (req.headers.authorization || "").replace(/Bearer\s?/, ""); // Bearer asfasnfkajsfnjk
    try {
        if (!token) {
            return res.status(401).json({ message: "Не авторизован" });
        }
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.userToken = decoded;
        next();
    } catch (e) {
        res.status(401).json({ message: "Не авторизован" });
    }
};

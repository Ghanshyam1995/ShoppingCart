var express = require("express");
const router = express.Router();
var sql = require("mssql");
var config = require("../configs/sql");
router.get("/login", (req, res, next) => {
    res.render('login', { title: "Login" })
});


router.post('/login', (req, res, next) => {
    var email = req.body.email;
    var password = req.body.password;
    sql.connect(config, (err) => {
        var request = new sql.Request()
            .input("Email", sql.NVarChar, email)
            .input("Password", sql.NVarChar, password);
        request.query("SELECT * from Users WHere Email=@Email AND Password=@Password", (err, user) => {
            if (err) throw err;
            req.session.user = user.recordset;

        });

    })
});
module.exports = router;
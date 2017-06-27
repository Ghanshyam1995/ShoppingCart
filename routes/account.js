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

    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email must be valid').isEmail();
    req.checkBody('password', 'Password is required').notEmpty();

    var errors = req.validationErrors();
    if (errors) {
        res.render('login', { errors: errors });
    } else {
        sql.connect(config, (err) => {
            var request = new sql.Request()
                .input("Email", sql.NVarChar, email)
                .input("Password", sql.NVarChar, password);
            request.query("SELECT * from Users WHere Email=@Email AND Password=@Password", (err, user) => {
                if (err) throw err;
                req.session.user = user.recordset;

            });

        })
    }
});

router.all('/cart', (req, res) => {
    res.render("cart", { title: "Cart", CartItems: req.session.cart });
})

router.get('/add-to-cart/:Id', (req, res) => {
    var productId = req.params.Id;
    sql.connect(config, (err) => {
        if (err) throw err;
        var request = new sql.Request().input("@ID", sql.Int, productId)
            .query("SELECT * from Products WHere ID=ID", (err, product) => {
                sql.close();
                if (product)
                    req.session.cart = product.recordset;
            });
    })
})

module.exports = router;
var express = require("express");
const router = express.Router();

router.get("/login", (req, res, next) => {
    res.render('login', { title: "Login" })
});


router.post('/login', (req, res, next) => {
    var email = req.body.email;
    var password = req.body.password;

});
module.exports = router;
var express = require("express");
const router = express.Router();
var sql = require("mssql");

var config = require("../configs/sql");

router.all("/:id", (req, res, next) => {
    var id = req.params.id;
    sql.connect(config, (err) => {
        var request = new sql.Request().input("ID", sql.Int, id);
        request.query("SELECT * from Products WHERE ID=@ID", (err, product) => {
            sql.close();
            if (err) throw err;
            res.render('Product', { title: "Product", products: product.recordset })
        })
    })


});

module.exports = router;
var express = require('express');
var path = require('path');
var sql = require("mssql");
var cookieParser = require('cookie-parser');
var session = require("express-session");
var bodyParser = require('body-parser');
var app = express();
var product = require("./routes/product");
var account = require("./routes/account");
var config = require("./configs/sql");
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
var port = process.env.port || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(session({ secret: "shopping-cart" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/products', product);

app.use('/account', account);
app.use('/', (req, res) => {
    sql.connect(config, (err) => {
        var request = new sql.Request();
        request.query("SELECT * from Category", (err, record) => {
            sql.close();
            if (err) throw err;
            res.render('index', { title: "Home", records: record.recordset })
        })
    })

});

app.listen(port, () => {

    console.log("App listening on port :" + port);
})
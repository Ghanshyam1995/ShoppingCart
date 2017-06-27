var express = require('express');
var flash = require('connect-flash');
var path = require('path');
var sql = require("mssql");
var cookieParser = require('cookie-parser');
var session = require("express-session");
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var compression = require('compression');
var app = express();
var product = require("./routes/product");
var account = require("./routes/account");
var config = require("./configs/sql");
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());
var port = process.env.port || 3000;
app.use(compression());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(session({ secret: "shopping-cart" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(flash());
app.use(function(req, res, next) {
    res.locals.success = req.flash('success');
    res.locals.errors = req.flash('error');
    next();
});
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


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});


// error handler
app.use(function(err, req, res, next) {

    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('404', { title: req.locals.message });
});
app.listen(port, () => {
    console.log("App listening on port :" + port);
})
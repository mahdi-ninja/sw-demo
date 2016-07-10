var express = require('express'),
    bodyParser = require('body-parser')

var customers = [];

var app = express();
app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/customers', function (req, res) {
    res.json(customers);
});

app.post('/add', function (req, res) {
    var id = Math.max.apply(Math, customers.map(function (customer) { return customer.id; })) + 1;
    customers.push({
        id: id,
        name: req.body.name,
        email: req.body.email
    })
    res.json({ success: true });
});

app.post('/remove', function (req, res) {
    customers = customers.filter(function (customer) { return customer.id != req.body.id; });
    res.json({ success: true });
});

app.listen(3000, function () {
    console.log('Started on port 3000...');
});

//dummy data
customers = customers.concat([{
        id: 1,
        name: "Aaron Washington",
        email: "awashington0@jalbum.net"
    }, {
        id: 2,
        name: "Todd Adams",
        email: "tadams1@google.de"
    }, {
        id: 3,
        name: "Diane Howell",
        email: "dhowell2@symantec.com"
    }, {
        id: 4,
        name: "Scott Ferguson",
        email: "sferguson3@elpais.com"
    }, {
        id: 5,
        name: "Diana Banks",
        email: "dbanks4@ucla.edu"
    }
]);

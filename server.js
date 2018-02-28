// Get dependencies
const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const csv = require('express-csv');
const app = express();

// Parsers for POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Point static path to dist
app.use(express.static(path.join(__dirname, 'dist')));

// CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', function(req,res) {
  res.sendStatus(200);
});

app.post('/api/report/csv', function(req,res) {
  // const fields = ['sale', 'employee', 'external', 'payment', 'items', 'date', 'price'];
  res.csv(req.body);
});

app.post('/api/send', function(req, res) {
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'managerb67@gmail.com',
      pass: 'laboratorio1'
    }
  });

  var mailOptions = {
    from: 'businessManager@gmail.com',
    to: req.body.to,
    subject: req.body.subject,
    text: req.body.content,
    html: req.body.html
  };

  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error);
      res.redirect('/');
    } else {
      console.log('Message sent.');
      res.redirect('/');
    }
  })

});


// Catch all other routes and return the index file
app.get('*', function(req, res){
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

/**
 * Get port from environment and store in Express.
 */
const port = process.env.PORT || '3000';
app.set('port', port);

/**
 * Create HTTP server.
 */
const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port, function(){
  console.log(`API running on http://localhost:${port}`);
});

//jshint esversion:6
require('dotenv').config();
const express = require('express');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const lodash = require('lodash');
const encrypt = require('mongoose-encryption');

const hostname = '127.0.0.1';
const port = 3000;

const app = express();
app.set('view engine', 'ejs');
app.use(bodyparser.urlencoded({ extended: true }));
app.use('/public', express.static('public'));

mongoose.connect('mongodb://127.0.0.1:27017/userDB', { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema({
   email: String,
   password: String
});


userSchema.plugin(encrypt, { secret: process.env.SECRETS, encryptedFields: ['password'] });

const user = mongoose.model('user', userSchema);

app.route('/')
   .get(function (req, res) {
      res.render('home');
   });



app.route('/login')

   .get(function (req, res) {
      res.render('login')
   })

   .post(function (req, res) {
      user.findOne({ email: req.body.username }, function (err, result) {
         if (err) {
            console.log(err)
         } else {
            if (result) {
               if (result.password === req.body.password) {
                  res.render('secrets');
               }
            }
         }
      })
   });



app.route('/register')

   .get(function (req, res) {
      res.render('register')
   })

   .post(function (req, res) {
      const newuser = new user({
         email: req.body.username,
         password: req.body.password
      });
      newuser.save(function (err) {
         if (err) {
            console.log(err)
         } else {
            res.render('secrets')
         }
      });
   });

app.listen(port, hostname, () => {
   console.log(`The server is running at http://${hostname}:${port}`);
});

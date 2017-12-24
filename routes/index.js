var express = require('express');
var router = express.Router();
var User = require('../models/user')

// GET /
router.get('/', function(req, res, next) {
  return res.render('index', { title: 'Home' });
});

// GET /about
router.get('/about', function(req, res, next) {
  return res.render('about', { title: 'About' });
});

// GET /contact
router.get('/contact', function(req, res, next) {
  return res.render('contact', { title: 'Contact' });
});

// GET /register
router.get('/register', (req, res, next)=>{
  // return res.send('NODEMON Register today!')
  res.render('register', { title: 'Sign Up' });
});

// POST /register
router.post('/register', (req, res, next)=>{
  if (req.body.email &&
      req.body.name &&
      req.body.favoriteBook &&
      req.body.password &&
      req.body.confirmPassword) {
        // Confirm user entered two matching passwords
        if (req.body.password !== req.body.confirmPassword) { 
          var err = new Error('Both passwords must match.')
          err.status = 400
          return next(err)
        } else {
          // Create an object for submitted data
          var userData = {
            email: req.body.email,
            name: req.body.name,
            favoriteBook: req.body.favoriteBook,
            password: req.body.password
          }
          // Use schema's create method to insert doc into mongoDB
          User.create(userData, (error, user)=>{
            if(error){
              return next(error)
            } else {
              //return res.send('User created!')
              return res.redirect('/profile')
            } 
          })
        }
  } else { 
      var err = new Error('All fields are required.')
      err.status = 400
      return next(err)
  }
})

module.exports = router;

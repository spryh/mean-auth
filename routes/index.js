var express = require('express');
var router = express.Router();
var User = require('../models/user')

// GET /
router.get('/', function(req, res, next) {
  // Simple session setting test
  // req.session.userId = 10101
  // console.log(req.session.userId)
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
  // render the Pug template
  res.render('register', { title: 'Sign Up' });
});

// GET /login
router.get('/login', (req, res, next)=>{
  // return res.send('Login page')
  res.render('login', { title: 'Log In' });
});

// GET /profile
router.get('/profile', (req, res, next)=>{
  if (!req.session.userId) {
    var err = new Error('User not authorized to view page.')
    err.status = 403
    return next(err)
  } else {
    User.findById(req.session.userId)
      .exec((error, user)=>{
        if(error){ return next(error) }
        else {
          return res.render('profile', {
            title: 'Profile',
            name: user.name,
            favorite: user.favoriteBook
          })
        }
      })
  }
  // res.render('login', { title: 'Log In' });
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
              // Create or add session.userId to document's _id
              req.session.userId = user._id
              console.log(req.session)
              console.log('Redirecting to /profile')
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

// POST /login
router.post('/login', (req, res, next)=>{
  // console.log('Logged In')
  // return res.send('Logged In')
  if (req.body.email &&
    req.body.password) {
      User.authenticate(req.body.email, req.body.password, function(error, user){
        if (error || !user) {
          var err = new Error('Unauthorized: Incorrect email or password.')
          err.status = 401
          return next(err)
        } else {
          // Create or add session.userId to document's _id
          req.session.userId = user._id
          console.log(req.session)
          console.log('Redirecting to /profile')
          return res.redirect('/profile')
        }
      })
  } else { 
    var err = new Error('Unauthorized: All fields are required.')
    err.status = 401
    return next(err)
  }
});

// GET /logout
router.get('/logout', (req, res, next)=>{
  if(req.session){
    // Delete the session object
    req.session.destroy((err)=>{
      if(err){ return next(err)}
      else{ return res.redirect('/')}
    })
  }
});

module.exports = router;

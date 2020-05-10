const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const Account = require('../models/account');

exports.getLogin = (req, res, _next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('login', {
    pageTitle: 'Log In',
    errMessage: message,
    validationErrors: []
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render('login', {
      pageTitle: 'Log In',
      errMessage: errors.array()[0].msg,
      validationErrors: errors.array()
    });
  }

  Account.findOne({ email: email })
  .then(account => {
    if (!account) {
      return res.status(422).render('login', {
        pageTitle: 'Log In',
        errMessage: 'Invalid email or password.',
        validationErrors: []
      });
    }
    bcrypt.compare(password, account.password)
    .then(doMatch => {
      if (doMatch) {
        req.session.loggedIn = true;
        req.session.account = account;
        return req.session.save(err => {
          console.log(err);
          res.redirect('/');
        });
      }
      return res.status(422).render('login', {
        pageTitle: 'Log In',
        errMessage: 'Invalid email or password.',
        validationErrors: []
      });
    })
    .catch(err => {
      console.log(err);
      res.redirect('/login');
    });
  })
  .catch(err => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });
};

exports.getSignup = (req, res, _next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('signup', {
    pageTitle: 'Sign Up',
    errMessage: message,
    validationErrors: []
  });
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render('signup', {
      pageTitle: 'Sign Up',
      errMessage: errors.array()[0].msg,
      validationErrors: errors.array()
    });
  }

  bcrypt.hash(password, 12)
  .then(hashedPassword => {
    const account = new Account({
      email: email,
      password: hashedPassword
    });
    return account.save();
  })
  .then(() => {
    res.redirect('/login');
  })
  .catch(err => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });
};

exports.postLogout = (req, res, _next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};
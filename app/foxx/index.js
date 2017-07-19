'use strict';
const joi = require('joi');
const createAuth = require('@arangodb/foxx/auth');
const createRouter = require('@arangodb/foxx/router');
const sessionsMiddleware = require('@arangodb/foxx/sessions');
const auth = createAuth();
const router = createRouter();
const users = module.context.collection('users');
const headerTransport = require('@arangodb/foxx/sessions/transports/header');
var console = require("console");  

var secret="This is a test test test";
const sessions = sessionsMiddleware({
  storage: module.context.collection('sessions'),
  transport: headerTransport({
    name: 'X-FOXXSESSID',
    ttl: 60 * 60 * 24 * 7, // one week in seconds
    algorithm: 'sha256',
    secret: secret 
  })
});

module.context.use(sessions);
// const cookieTransport = require('@arangodb/foxx/sessions/transports/cookie');
// Pass in a secure secret from the Foxx configuration
// const secret = module.context.configuration.cookieSecret;
// const sessions = sessionsMiddleware({
//   storage: module.context.collection('sessions'),
  // transport: cookieTransport({
  //   name: 'FOXXSESSID',
  //   ttl: 60 * 60 * 24 * 7, // one week in seconds
  //   algorithm: 'sha256',
  //   secret: secret
//   })
// });
// const sessions = sessionsMiddleware({
//   storage: module.context.collection('sessions'),
//   transport: ['header']
// });
module.context.use(sessions);
module.context.use(router);

router.get('/user', function (req, res) {
  try {
    const user = users.document(req.session.uid);
    // send back all user data
    res.send({username: user.username, userid: user._id});
  } catch (e) {
    res.send({username: null});
  }
})
.description('Returns the currently active username.');

router.post('/login', function (req, res) {
  // This may return a user object or null
  const user = users.firstExample({
    username: req.body.username
  });
  const valid = auth.verify(
    // Pretend to validate even if no user was found
    // not dummy Student users don't have any authData
    user ? user.authData : {},
    req.body.password
  );
  if (!valid) res.throw('unauthorized');
  // Log the user in
  req.session.uid = user._key;
  req.sessionStorage.save(req.session);
  // send back the username in the response
  res.send({success: true, username: user.username, userid: user._id, chgPwd: user.chgPwd});
})
.body(joi.object({
  username: joi.string().required(),
  password: joi.string().required()
}).required(), 'Credentials')
.description('Logs a registered user in.');

router.post('/logout', function (req, res) {
  if (req.session.uid) {
    req.session.uid = null;
    req.sessionStorage.save(req.session);
  }
  res.send({success: true});
})
.description('Logs the current user out.');

router.post('/password', function (req, res) {
  // const user = req.body;
  try { 
    // const user = users.document({_key: req.session.uid});
      const user = users.firstExample({
    _key: req.session.uid
  });
  console.log("user", user);
    console.log("req.body.password", req.body.password);
    // Create an authentication hash
    let authData = auth.create(req.body.password);
    let chgPwd = false;
    // delete req.body.password;
    // const meta = users.save(user);
    // Object.assign(user, meta);
    // let updatedata = {authData: auth.create(req.body.password), chgPwd: 'false'};
    // delete req.body.password;
    const meta = users.update(user, {authData: authData, chgPwd: chgPwd});
    Object.assign(user, meta);
  } catch (e) {
    // Failed to save the user
    // We'll assume the UniqueConstraint has been violated
    res.throw('bad request', 'Problem Updating password', e);
  }
  // Log the user in
  // req.session.uid = user._key;
  // req.sessionStorage.save(req.session);
  res.send({success: true});
})
.body(joi.object({
  username: joi.string().email(),
  password: joi.string().regex(/^(?=.*[A-Z])(?=.*[0-9].*[0-9])[a-zA-Z0-9]{8,16}$/),
  chgPwd: joi.boolean(),
}).required(), 'Credentials')
.description('Creates a new user and logs them in.');


router.post('/signup', function (req, res) {
  const user = req.body;
    console.log("signup user", user);
    console.log("signup req.body.password", req.body.password);
  try {
    // Create an authentication hash
    user.authData = auth.create(user.password);
    delete user.password;
    const meta = users.save(user);
    Object.assign(user, meta);
  } catch (e) {
    // Failed to save the user
    // We'll assume the UniqueConstraint has been violated
    res.throw('bad request', 'Username already taken', e);
  }
  // Log the user in
  req.session.uid = user._key;
  req.sessionStorage.save(req.session);
  res.send({success: true, username: user.username, userid: user._id});
})
// password must have 1 capital letters and  2 digits
.body(joi.object({
  username: joi.string().email(),
  password: joi.string().regex(/^(?=.*[A-Z])(?=.*[0-9].*[0-9])[a-zA-Z0-9]{8,16}$/),
  chgPwd: joi.boolean().default(true),
  active:  joi.boolean().default(true),
  first: joi.string(),
  last: joi.string(),
  school: joi.string(),
  studentId: joi.string().default('na'),
  mentor: joi.string().default('na'),
  role: joi.string(),
  createdBy: joi.string(),
  dateCreated: joi.date().default(Date.now, 'created date'),
  updateBy: joi.string(),
  dateUpdated: joi.date(),
}).required(), 'Credentials')
.description('Creates a new user and logs them in.');




// // password must have 1 capital letters and  2 digits
// .body(joi.object({
//   username: joi.string().email(),
//   password: joi.string().regex(/^(?=.*[A-Z])(?=.*[0-9].*[0-9])[a-zA-Z0-9]{8,16}$/),
//   chgPwd: joi.boolean().default(true),
//   first: joi.string(),
//   last: joi.string(),
//   company: joi.string(),
//   role: joi.string(),
//   createdBy: joi.string(),
//   dateCreated: joi.date(),

// }).required(), 'Credentials')
// .description('Creates a new user and logs them in.');
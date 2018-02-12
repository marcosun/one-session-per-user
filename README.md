# one-session-per-user
One session per user is a Connect middleware, which ensures that one user must have one active session at most. Multiple sessions will be deactivated by deleting those sessions mongoose created by expressjs/sessions. It depends on express-session, mongoose, passport, passport-local, and passport-local-mongoose. Other passport strategies are not currenty supported, however OAuth2 has been planned to support.

## Installation

one-session-per-user is available as an [npm package](https://www.npmjs.com/package/one-session-per-user).

```sh
yarn add one-session-per-user
npm install --save one-session-per-user
```

## Docs

### Step One: Import one-session-per-user and attach it after passport.authenticate

```javascript
// auth.js
import express from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';
import passport from 'passport';
import {Strategy as LocalStrategy} from 'passport-local';
import connectMongo from 'connect-mongo';
import oneSessionPerUser from 'one-session-per-user';

import User from './user.js';

const app = express();

const MongoStore = connectMongo(session);
app.use(session({
  store: new MongoStore({url: 'mongodb://localhost/test-app'}),
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(passport.initialize());
app.use(passport.session());

// Passport config
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const login = (req, res, next) => {
  res.send('OK');
};

router.post('/login', passport.authenticate('local'), oneSessionPerUser(), login);
```

```javascript
// user.js
import mongoose from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';

const Schema = mongoose.Schema;

const User = new Schema({
});

User.plugin(passportLocalMongoose);

export default mongoose.model('User', User);
```

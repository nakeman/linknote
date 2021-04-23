import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";

import {UsersSchema as User} from "./models/User.js"

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
    },
    (email, password, done) => {
      // Match Email's User
      const user = User.findOne({ email: email });

      if (!user) {
        return done(null, false, { message: "Not User found." });
      } else {
        // Match Password's User
        const match = user.matchPassword(password);
        if (match) {
          return done(null, user);
        } else {
          return done(null, false, { message: "Incorrect Password." });
        }
      }
    }
  )
);


//  object serialization: translating a data structure or object state into a format that can be stored
//  as simple as serializing the user ID, and finding the user by ID when deserializing.
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

export let init_passport = passport.initialize();
export let init_session = passport.session();
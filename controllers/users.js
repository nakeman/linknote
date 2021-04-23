//Controller: focus on http req handling

//import User from '../models/User.js';
import passport from 'passport';


export const signin = passport.authenticate("local", {
    successRedirect: "/notes",
    failureRedirect: "/users/signin",
    failureFlash: true,
    });
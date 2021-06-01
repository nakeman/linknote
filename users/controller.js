//Controller: focus on http req handling

import User from './model.js';
import passport from 'passport';


export const signin = passport.authenticate("local", {
    successRedirect: "/notes",
    failureRedirect: "/signin",
    failureFlash: true,
    });

export const signin2 = function(req, res, next) {
        passport.authenticate('local', function(err, user, info) {
          if (err) { return next(err); }
          if (!user) { 
              return res.json(info);
            }
          req.logIn(user, function(err) {
            if (err) { return next(err); }
            //res.header('Content-Type', 'text/html');
            //return res.render('notes');
            return res.json({success:true, message:"登录成功 ｜ Login Success."});
          });
        })(req, res, next);
      };

export const signup = async (req, res) => {
    //let errors = [];
    let result = {};
    const { email, password } = req.body;
    // if (password != confirm_password) {
    //     errors.push({ text: "Passwords do not match." });
    // }
    //console.log(req.body);
    let  reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
    if (!reg.test(email)) {
        result.success = false;
        result.message = "帐号必须是Email格式｜You must use Eamil as name." 
        res.json(result);
    }
    if (password.length < 4) {
        result.success = false;
        result.message = "密码至少4个字符｜Passwords must be at least 4 characters." 
        //errors.push({ text: "密码至少4个字符｜Passwords must be at least 4 characters." });
        res.json(result);
    }
 
    // Look for email coincidence
    const emailUser = await User.findOne({ email: email });
    if (emailUser) {
        result.message = "用户名已经存在｜The Email is already in use.";
        result.success = false;
    } else {
    // Saving a New User
        const newUser = new User({ email, password });
        newUser.password = await newUser.encryptPassword(password);
        await newUser.save();
        result.message = "注册成功｜You are registered.";
        result.success = true;
    }

    res.json(result);
};

export const logout = (req, res) => {
    req.logout();
    req.flash("success_msg", "You are logged out now.");
    res.redirect("/");
  };
  
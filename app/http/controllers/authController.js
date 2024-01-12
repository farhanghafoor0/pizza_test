const User = require("../../models/user");
const bcrypt = require("bcrypt");
const passport = require('passport');


function authController() {
  const _getRedirectUrl = (req) => {
    return req.user.role === 'admin' ? '/admin/orders' : '/my-orders'
  }

  return {
    login(req, res, next) {
      res.render("auth/login");
    },
    postLogin(req, res, next) {
      passport.authenticate("local", (err, user, info) => {
        console.log(user);
        console.log(info);
        if (err) {
          req.flash("error", info.message);
          return next(err);
        }

        if (!user) {
          req.flash("error", info.message);
          return res.redirect("/login");
        }

        req.logIn(user, (err) => {
          if (err) {
            req.flash("error", info.message);
            return next(err);
          }
          

          return res.redirect(_getRedirectUrl(req));
        });
      })(req, res, next)

    },
    register(req, res, next) {
      res.render("auth/register");
    },
    async postRegister(req, res) {
      const { name, email, password } = req.body;
      // console.log(req.body);

      // Validate Request
      if (!name || !email || !password) {
        req.flash("error", "All Fields are required!");
        return res.redirect("/register");
      }

      try {
        // Check if email exists
        const emailExists = await User.exists({ email: email });

        if (emailExists) {
          req.flash("error", "Email already taken");
          req.flash("name", name);
          req.flash("email", email);
          return res.redirect("/register");
        }
      } catch (error) {
        // Handle specific error types or log the error for debugging
        console.error(error);
        req.flash("error", "Something went wrong");
        req.flash("name", name);
        req.flash("email", email);
        return res.redirect("/register");
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a User
      const user = new User({
        name: name,
        email: email,
        password: hashedPassword,
      });

      await user
        .save()
        .then((user) => {
          // Login
          return res.redirect("/");
        })
        .catch((err) => {
          req.flash("error", "Something went wrong");
          req.flash("name", name);
          req.flash("email", email);
          return res.redirect("/register");
        });
    },
    logout(req, res, next) {
      req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/login');
      });
    }
  };
}

module.exports = authController;

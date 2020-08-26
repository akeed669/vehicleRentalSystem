const express = require('express');  //
const mongoose = require('mongoose');
const ejs=require("ejs");
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const path = require('path')
//const session = require('client-sessions');
const Customer = require('./models/userModel')
//const Admin = require('./models/userModel')
const routes = require('./routes/route.js');

require("dotenv").config({
  path: path.join(__dirname, "../.env")
});

const app = express();
app.set('view engine', 'ejs');

app.use(express.static("public"));

const PORT = process.env.PORT || 3000;

mongoose
.connect('mongodb://localhost:27017/rbac',{ useNewUrlParser: true,useUnifiedTopology: true })
.then(() => {
  mongoose.set('useFindAndModify', false);
  mongoose.set('useCreateIndex', true);
  console.log('Connected to the Database successfully');
})
.catch (error => console.error("Could not connect",error))

app.use(bodyParser.urlencoded({ extended: true }));

app.use(async (req, res, next) => {
  if (req.headers["x-access-token"]) {
    const accessToken = req.headers["x-access-token"];
    const { userId, exp } = await jwt.verify(accessToken, process.env.JWT_SECRET);
    // Check if token has expired
    if (exp < Date.now().valueOf() / 1000) {
      return res.status(401).json({ error: "JWT token has expired, please login to obtain a new one" });
    }
    res.locals.loggedInUser = await User.findById(userId); next();
  } else {
    next();
  }
});

// app.use(session({
//   cookieName: 'session',
//   secret: 'random_string_goes_here',
//   duration: 30 * 60 * 1000,
//   activeDuration: 5 * 60 * 1000,
// }));

app.use('/', routes); app.listen(PORT, () => {
  console.log('Server is listening on Port:', PORT)
})



















//mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm


//GET REQUESTS



app.get("/",function(req,res){
  res.render("home");
})
//
app.get("/login",function(req,res){
  res.render("login");
})

app.get("/book",function(req,res){
  res.render("booking");
})
// app.get("/login/admin",function(req,res){
//   res.render("loginAdmin");
// })

// // app.get("/login/admin",function(req,res){
// //   res.render("adminlogin");
// // })
//
app.get("/register",function(req,res){
  res.render("register");
})
//
// app.get("/userhome",function(req,res){
//
//   const user_id = req.user.user_id;
//   console.log(user_id);
//
//   // Vehicle.find(function(err,foundVehicles){
//   //   if(!err){
//   //     if(foundVehicles){
//   //       res.render("userhome",{allVehicles:foundVehicles})
//   //     }
//   //   }
//   // })
// });
//
// app.get("/logout",function(req,res){
//   req.logout();
//   res.redirect("/")
// })
//
// app.get("/submit",function(req,res){
//   res.render("submit")
// })
//
// app.get("/userhome/bookings",function(req,res){
//   //res.render("register");
// })
//
// app.get("/userhome/bookings/:bookingId",function(req,res){
//   //res.render("register");
// })
//
// /// POST REQUESTS
//
// app.post("/login",function(req,res){
//   const customer=new Customer({
//
//     username:req.body.username,
//     password:req.body.password
//   });
//
//   req.login(customer,function(err){
//     if(err){
//       console.log(err)
//       res.redirect("/register")
//     }else{
//       passport.authenticate("local")(req,res,function(){
//         res.redirect("/userhome")
//       })
//     }
//   })
// });
//
// // app.post("/login/admin",function(req,res){
// //   const admin=new Admin({
// //     username:req.body.username,
// //     password:req.body.password
// //   });
// //
// //   req.login(admin,function(err){
// //     if(err){
// //       console.log(err)
// //       res.redirect("/login")
// //     }else{
// //       passport.authenticate("local")(req,res,function(){
// //         res.redirect("/submit")
// //       })
// //     }
// //   })
// // });
//
// app.post("/signup",function(req,res){
//   Customer.register({
//     email:req.body.username,
//     cname:req.body.cname,
//     blacklisted:false,
//     repeater:false,
//     dob:req.body.dob
//   },
//     req.body.password,function(err,customer){
//
//     if(err){
//       console.log(err)
//       res.redirect("/register")
//     } else{
//       passport.authenticate("local")(req,res,function(){
//         res.redirect("/userhome")
//       })
//     }
//   })
//
// });

// app.post("/userhome/bookings/new",function(req,res){
//   Booking.create({
//     customer:customerSchema,
//     vehicle:vehicleSchema,
//     rentalPeriod:req.body.period,
//     rentCost:rentalPeriod*vehicle.dailyRent,
//     bookingExtras:[extrasSchema],
//     //bookingExtension:extensionSchema,
//     lateReturn:,
//     insurance:
//   })
// })

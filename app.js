var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    passport    = require("passport"),
    methodOverride = require("method-override"),
    LocalStrategy = require("passport-local"),
    nodemailer = require('nodemailer'),
    crypto      = require("crypto"),
    async       = require("async"),
    flash       =require("connect-flash"),
    User        = require("./models/user"),
    Role        = require("./models/role"),
    Schoolrep   = require("./models/schoolrep"),
    Contributor   = require("./models/contributor");

//prod db: mongodb://<dbuser>:<dbpassword>@ds159662.mlab.com:59662/t2ti
//"mongodb://t2ti:t2ti2017@ds159662.mlab.com:59662/t2ti"
//localDB: mongodb://localhost/ngo1
mongoose.connect("mongodb://t2ti:t2ti2017@ds159662.mlab.com:59662/t2ti");
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs") ;
app.use(methodOverride("_method"));
app.use(flash());

app.use(require("express-session")({
    secret:"abc",
    resave:false,
    saveUninitialized: false
    
    
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//SCHEMA



//var Schoolrep=mongoose.model("Schoolrep",schoolrepSchema);
app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error=req.flash("error");
   res.locals.success=req.flash("success");
   next();
});

var Templist=[{sname:"sandy",rname:"vijaya high school"},
{sname:"sandy1",rname:"vijaya high school1"}
];
app.get("/",function(req,res){
    res.render("main");
    
});
app.get("/main",function(req,res){
    res.render("main",{currentUser:req.user});
    
});

app.get("/new",function(req,res){
   res.render("new");
    
});
app.get("/new/Contributor",function(req,res){
    res.render("contrinew");
});

var hasOwnProperty = Object.prototype.hasOwnProperty;

function isEmpty(obj) {

    // null and undefined are "empty"
    if (obj == null) return true;

    // Assume if it has a length property with a non-zero value
    // that that property is correct.
    if (obj.length > 0)    return false;
    if (obj.length === 0)  return true;

    // If it isn't an object at this point
    // it is empty, but it can't be anything *but* empty
    // Is it empty?  Depends on your application.
    if (typeof obj !== "object") return true;

    // Otherwise, does it have any properties of its own?
    // Note that this doesn't handle
    // toString and valueOf enumeration bugs in IE < 9
    for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) return false;
    }

    return true;
}
app.get("/details/SchoolRep/:id",function(req,res){
    console.log(req.user.id);
     Schoolrep.find({username:req.user.id},function(err,rep){
         if(err){
             req.flash("error","No records found");
             res.redirect("/new");
         }
         else{
             console.log(isEmpty(rep));
             
             if(isEmpty(rep))
             {
                 console.log(rep);
                  res.redirect("/new");
             }
             else
             {
             console.log(rep);
             res.render("details",{rep:rep});
             }
         }
     });
    
});
app.post("/details/SchoolRep",isLoggedIn,function(req,res){
   // console.log(req.user.id);
    var Infra=[];
    var Digital=[];
    var Stationaries=[];
    var Ecurriculum=[];
    var sname=req.body.sname;
    var userid=req.user.id;
    var rname=req.body.rname;
    var address=req.body.address;
    var city=req.body.city;
    var pincode=req.body.pincode;
    var email=req.body.email;
    var telephone=req.body.telephone;
    var mobile=req.body.mobile;
    console.log(req.body.laptop);
     Infra.push({
      fan : req.body.fan,
     lights:req.body.lights,
     purifier: req.body.purifier,
     board:req.body.board,
     tboys:req.body.tboys,
     tgirls:req.body.tgirls,
 } );
 console.log(req.body.laptop);
 Digital.push({
     laptop:req.body.laptop,
     keyboard:req.body.keyboard,
     mouse:req.body.mouse,
     cpu:req.body.cpu,
     monitor:req.body.monitor,
     projector:req.body.projector,
 });
 Stationaries.push({
     pen:req.body.pen,
     pencil:req.body.pencil,
     bags:req.body.bags,
     rbooks:req.body.rbooks,
     urbooks:req.body.urbooks,
     mbooks:req.body.mbooks,
     cbooks:req.body.cbooks,
     dictonary:req.body.dictonary,
     atlas:req.body.atlas,
     eraser:req.body.eraser,
     sharpner:req.body.sharpner,
     gbox:req.body.gbox,
 });
     
     console.log(Stationaries);
Ecurriculum.push({
    hygiene:req.body.hygiene,
    eawarness:req.body.eawarness,
    mscience:req.body.mscience,
    karate:req.body.karate,
    yoga:req.body.yoga,
    dance:req.body.dance,
    istory:req.body.istory,
    craft:req.body.craft,
    debate:req.body.debate,
});
 
 
   //nsole.log(Infra);
   var Schoolrepnew={sname:sname,username:userid,rname:rname,address:address,city:city,pincode:pincode,email:email,
  telephone:telephone,mobile:mobile,Infra:Infra,Digital:Digital,Stationaries:Stationaries,Ecurriculum:Ecurriculum};
 // console.log(Schoolrepnew);
  Schoolrep.create(Schoolrepnew, function(err, newentry){
           if(err){
               req.flash("error","Something went wrong ! Please enter the details again");
               res.redirect("/new");
           } else {
               
               
               
               res.redirect('/details/SchoolRep/'+ userid);
           }
        });
});
app.get("/details/SchoolRep/:id/edit",function(req,res){
    Schoolrep.findById(req.params.id,function(err, founditem) {
        if(err)
        {
            console.log(err);
        }
        else{
            //console.log("found item" +founditem);
           res.render("edit",{schoolrep:founditem}); 
        }
        
    });
   // res.render("edit");
});

app.put("/details/SchoolRep/:id",function(req,res){
 var Infra=[];
    var Digital=[];
    var Stationaries=[];
    var Ecurriculum=[];
    var sname=req.body.sname;
    var userid=req.user.id;
    var rname=req.body.rname;
    var address=req.body.address;
    var city=req.body.city;
    var pincode=req.body.pincode;
    var email=req.body.email;
    var telephone=req.body.telephone;
    var mobile=req.body.mobile;
    //console.log(req.body.laptop);
     Infra.push({
      fan : req.body.fan,
     lights:req.body.lights,
     purifier: req.body.purifier,
     board:req.body.board,
     tboys:req.body.tboys,
     tgirls:req.body.tgirls,
 } );
 //console.log(req.body.laptop);
 Digital.push({
     laptop:req.body.laptop,
     keyboard:req.body.keyboard,
     mouse:req.body.mouse,
     cpu:req.body.cpu,
     monitor:req.body.monitor,
     projector:req.body.projector,
 });
 Stationaries.push({
     pen:req.body.pen,
     pencil:req.body.pencil,
     bags:req.body.bags,
     rbooks:req.body.rbooks,
     urbooks:req.body.urbooks,
     mbooks:req.body.mbooks,
     cbooks:req.body.cbooks,
     dictonary:req.body.dictonary,
     atlas:req.body.atlas,
     eraser:req.body.eraser,
     sharpner:req.body.sharpner,
     gbox:req.body.gbox,
 });
     
     console.log(Stationaries);
Ecurriculum.push({
    hygiene:req.body.hygiene,
    eawarness:req.body.eawarness,
    mscience:req.body.mscience,
    karate:req.body.karate,
    yoga:req.body.yoga,
    dance:req.body.dance,
    istory:req.body.istory,
    craft:req.body.craft,
    debate:req.body.debate,
});
 
 
   //nsole.log(Infra);
   var Schoolrepnew={sname:sname,username:userid,rname:rname,address:address,city:city,pincode:pincode,email:email,
  telephone:telephone,mobile:mobile,Infra:Infra,Digital:Digital,Stationaries:Stationaries,Ecurriculum:Ecurriculum};
    Schoolrep.findByIdAndUpdate(req.params.id,Schoolrepnew,function(err,updatedrep){
        if(err)
        {
            console.log(err);
        }
        else{
            req.flash("sucess","Details sucessfully edited");
            res.redirect("/details/SchoolRep/"+req.params.id);
        }
    });
});

//AUTH ROUTES

//show register form

app.get("/register",function(req,res){
    res.render("register");
    
});

app.get("/School/details/:id",function(req, res) {
    Schoolrep.findById(req.params.id,function(err, school) {
        if(err)
        {
            console.log("error");
        }
        //console.log(school);
        
        res.render("schooldetails",{school:school});
    });
});
app.post("/details/Contributor",function(req, res) {
    
    var name=req.body.name;
    var userid=req.user.id;
    //var rname=req.body.rname;
    var address=req.body.address;
    var city=req.body.city;
    var pincode=req.body.pincode;
    var email=req.body.email;
    var telephone=req.body.telephone;
    var mobile=req.body.mobile;
    var NewContributor={name:name,username:userid,address:address,city:city,pincode:pincode,email:email,
  telephone:telephone,mobile:mobile};
  Contributor.create(NewContributor,function(err,contri){
      if(err)
      {
          console.log(err);
      }
      else{
          
      }
  });
  res.redirect("/Contributor/ "+ req.user.id);      
    
             
             
             
         
     
});
app.get("/Contributor/:id",function(req,res){
    Contributor.find({username:req.user.id},function(err,rep){
         if(err){
             req.flash("error","No records found");
             res.redirect("/new");
         }
         else{
             console.log(isEmpty(rep));
             
             
             if(isEmpty(rep))
             {
                 console.log(rep);
                  res.redirect("/new/Contributor");
             }
             else{
             

    Schoolrep.find({},function(err, schools) {
        if(err)
        {
            console.log(err);
        }
        else{
            res.render("contributor",{schools:schools});
        }
    });
   // res.render("Contributor");
         }
         }
});
});
app.get("/Contributor/details/:id",function(req, res) {
    Schoolrep.findById(req.params.id,function(err,details){
        if(err){
            console.log(err);
        }
        else{
            //var details1=JSON.parse(details);
             //var details1= JSON.parse(details);
            //console.log(details);
            res.render("resource",{details:details});
        }
    });
});

app.post("/Contributor/details/:id",function(req, res) {
    //console.log("Id"+req.body.fan);
 Schoolrep.findByIdAndUpdate(req.params.id, { $inc: { "Infra.0.fan": -(req.body.fan), 
 "Infra.0.lights": -(req.body.lights),"Infra.0.purifier": -(req.body.purifier),"Infra.0.board": -(req.body.board),
 "Infra.0.tboys": -(req.body.tboys),"Infra.0.tgirls": -(req.body.tgirls),
 "Digital.0.laptop": -(req.body.tboys),"Digital.0.monitor": -(req.body.monitor),"Digital.0.cpu": -(req.body.cpu),
 "Digital.0.projector": -(req.body.projector),"Digital.0.mouse": -(req.body.mouse),"Digital.0.keyboard": -(req.body.keyboard),
 "Stationaries.0.rbooks": -(req.body.rbooks),"Stationaries.0.urbooks": -(req.body.urbooks),"Stationaries.0.mbooks": -(req.body.mbooks),
"Stationaries.0.cbooks": -(req.body.cbooks),"Stationaries.0.dictonary": -(req.body.dictonary),"Stationaries.0.atlas": -(req.body.atlas),
 "Stationaries.0.bags": -(req.body.bags),"Stationaries.0.pencil": -(req.body.pencil),"Stationaries.0.pen": -(req.body.pen),
 "Stationaries.0.eraser": -(req.body.eraser),"Stationaries.0.sharpner": -(req.body.sharpner),"Stationaries.0.gbox": -(req.body.gbox),
 "Ecurriculum.0.hygiene": -(req.body.hygiene),"Ecurriculum.0.eawarness": -(req.body.eawarness),"Ecurriculum.0.mscience": -(req.body.mscience),
 "Ecurriculum.0.karate": -(req.body.karate),"Ecurriculum.0.yoga": -(req.body.yoga),"Ecurriculum.0.dance": -(req.body.dance),
 "Ecurriculum.0.craft": -(req.body.craft),"Ecurriculum.0.istory": -(req.body.istory),"Ecurriculum.0.debate": -(req.body.debate)
 }
 }, function (error, result) {
    if (error)
 {
     console.log(error);
 }
    else{ 
    //console.log(result);
    }
});
 var Infra=[];
    var Digital=[];
    var Stationaries=[];
    var Ecurriculum=[];
    var School=[];
Infra.push({
      fan : req.body.fan,
     lights:req.body.lights,
     purifier: req.body.purifier,
     board:req.body.board,
     tboys:req.body.tboys,
     tgirls:req.body.tgirls,
 } );
 //console.log(req.body.laptop);
 Digital.push({
     laptop:req.body.laptop,
     keyboard:req.body.keyboard,
     mouse:req.body.mouse,
     cpu:req.body.cpu,
     monitor:req.body.monitor,
     projector:req.body.projector,
 });
 Stationaries.push({
     pen:req.body.pen,
     pencil:req.body.pencil,
     bags:req.body.bags,
     rbooks:req.body.rbooks,
     urbooks:req.body.urbooks,
     mbooks:req.body.mbooks,
     cbooks:req.body.cbooks,
     dictonary:req.body.dictonary,
     atlas:req.body.atlas,
     eraser:req.body.eraser,
     sharpner:req.body.sharpner,
     gbox:req.body.gbox,
 });
     
     //console.log(Stationaries);
Ecurriculum.push({
    hygiene:req.body.hygiene,
    eawarness:req.body.eawarness,
    mscience:req.body.mscience,
    karate:req.body.karate,
    yoga:req.body.yoga,
    dance:req.body.dance,
    istory:req.body.istory,
    craft:req.body.craft,
    debate:req.body.debate,
});
School.push({
    sid: req.params.id ,
    Infra:Infra,
    Digital:Digital,
    
});


Contributor.update({username:req.user.id},{$push:{School:School}},function(err, result) {
    if(err)
    {
        console.log(err);
    }
    //console.log(result);
   else{
        
            
        
    }
});
console.log(req.params.id);
Contributor.find(
    
    { "School.0.sid":req.params.id} ,function(err, re){
            if(err)
            {
               console.log(err);
               
            }
            else{
              //  var as = JSON.parse(re[0].School[0]["Infra"]);
                console.log("Re is : "+re[0]);
            }
            
        
            
        } );


var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'sandeepb518s@gmail.com',
    pass: 'sandeep is great'
  }
});

var mailOptions = {
  from: 'sandeepb518s@gmail.com',
  to: 'sandeepb518s@gmail.c',
  subject: 'Sending Email using Node.js',
  text: '1st mail'
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'sandeepb518s@gmail.com',
    pass: 'sandeep is great'
  }
});

var mailOptions = {
  from: 'sandeepb518s@gmail.com',
  to: 'deepak.nk92@gmail.c',
  subject: 'Sending Email using Node.js',
  text: '2nd mail'
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});

 //console.log(Schoolrep.id);
res.redirect("/Contributor/details/"+req.params.id);
});

app.post("/register", function(req, res){
    var newUser = new User({username: req.body.email});
    console.log(newUser);
     var flag=1;
   
    var role = req.body.role;
  //  console.log(role);
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            flag=0;
            //console.log("1st flag: "+flag);
            req.flash("error",err.message );
            console.error(err);
            return res.render("register");
        }
        
        //console.log(user);
    passport.authenticate("local")(req, res, function(){
     
           // res.redirect("/main");
        });
        if (flag==1)
        var  username=user.id;
       //console.log(username);
       var newroleuser={username: username, role: role};
       Role.create(newroleuser, function(err, ro){
           if(err){
            
               console.log(err);
               
           }
        else{
       
    
      }
       
        
       
     });
     
     
    });
      if(req.body.role=="Schoolrep"){
        return res.render("login");
        }
        else{
            res.redirect("/login");
     
       
     }  
   // var username=user.param;
   // console.log(req.body);
  
   // Role.create(newroleuser, function(err, role){
           //if(err){
            
            //   console.log(err);
          // }
        //else {
      //  console.log("sucess");
    //    }
   //  });
     
});


app.get("/login", function(req, res){
   res.render("login"); 
});
// handling login logic
app.post("/login", passport.authenticate("local", 
    {
       
        failureRedirect: "/login"
    }), function(req, res){
      User.find({username:req.body.username},function(err,user){
          if(err)
          {
              
              
              console.log(err);
          }
          else
          {
              console.log(user[0].id);
              Role.find({username:user[0].id},function(err,role){
                if(err)
          {
              console.log(err);
          }  
          else{
              if(role[0].role=="Schoolrep")
              {
                  //res.redirect("/new");
                  req.flash("success","Welcome to this application"+user.username);
                  res.redirect("/details/SchoolRep/" + user[0].id);
              }
              else
              {
                  res.redirect("/Contributor/" + user[0].id);
              }
          }
              });
          }
          
     });
});

// forgot password
app.get('/forgot', function(req, res) {
  res.render('forgot');
});

app.post('/forgot', function(req, res, next) {
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      User.findOne({ username: req.body.email }, function(err, user) {
        if (!user) {
          //req.flash('error', 'No account with that email address exists.');
          return res.redirect('/forgot');
        }
        console.log(user);
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.save(function(err) {
          done(err, token, user);
        });
      });
    },
    function(token, user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail', 
        auth: {
          user: 'sandeepb518s@gmail.com',
          pass:'sandeep is great'
        }
      });
      var mailOptions = {
        to: user.username,
        from: 'sandeepb518s@gmail.com',
        subject: 'Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        console.log('mail sent');
       // req.flash('success', 'An e-mail has been sent to ' + user.username + ' with further instructions.');
        done(err, 'done');
      });
    }
  ], function(err) {
    if (err) return next(err);
    res.redirect('/forgot');
  });
});
app.get('/reset/:token', function(req, res) {
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
    if (!user) {
      req.flash('error', 'Password reset token is invalid or has expired.');
      return res.redirect('/forgot');
    }
    res.render('reset', {token: req.params.token});
  });
});


app.post('/reset/:token', function(req, res) {
  async.waterfall([
    function(done) {
      User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
          req.flash('error', 'Password reset token is invalid or has expired.');
          return res.redirect('back');
        }
        if(req.body.password === req.body.confirm) {
          user.setPassword(req.body.password, function(err) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;

            user.save(function(err) {
              req.logIn(user, function(err) {
                done(err, user);
              });
            });
          });
        } else {
            //req.flash("error", "Passwords do not match.");
            return res.redirect('back');
        }
      });
    },
    function(user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail', 
        auth: {
          user: 'sandeepb518s@gmail.com',
          pass: 'sandeep is great'
        }
      });
      var mailOptions = {
        to: user.username,
        from: 'sandeepb518s@gmail.com',
        subject: 'Your password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        req.flash('success', 'Success! Your password has been changed.');
        done(err);
      });
    }
  ], function(err) {
    res.redirect('/main');
  });
});

app.get("/about",function(req, res) {
  res.render("aboutus") ; 
});

app.get("/contact",function(req, res) {
  res.render("contact") ; 
});

app.get("/logout",function(req, res) {
    req.logout();
    req.flash("success","Logged you out");
   res.redirect("/main") ;
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","Please Login to continue");
    res.redirect("/login");
}
    

app.listen(process.env.PORT,process.env.IP,function(){
    console.log("Server started");
});
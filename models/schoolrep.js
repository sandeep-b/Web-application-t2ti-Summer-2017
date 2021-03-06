var mongoose=require("mongoose");
var passportLocalMongoose=require("passport-local-mongoose");

var SchoolrepSchema=new mongoose.Schema({
   sname :String,
   rname :String,
   address : String,
   city: String,
   pincode: Number,
   telephone:Number,
   mobile: Number,
   email : String,
   username:{
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
        },
Infra :[{

     lights :Number,
     fan: Number,
     purifier : Number,
     board:Number,
     tboys:Number,
     tgirls:Number,
     
}],
Digital :[{

     laptop :Number,
     monitor: Number,
     keyboard : Number,
     mouse:Number,
     projector:Number,
     cpu:Number,
     
     
}],
Stationaries :[{

     rbooks :Number,
     urbooks: Number,
     mbooks : Number,
     cbooks:Number,
     dictonary:Number,
     atlas:Number,
     bags:Number,
     pencil:Number,
     pen:Number,
     eraser:Number,
     sharpner: Number,
     gbox:Number,
     
     
}],

Services : [{
    internet:Boolean,
    newspaper:Boolean,
    magazine:Boolean,
    
}],

Ecurriculum:[{
    hygiene:Number,
    eawarness:Number,
    mscience:Number,
    karate:Number,
    yoga:Number,
    dance:Number,
    istory:Number,
    craft:Number,
    debate:Number,
}],
entries:[{
          type: mongoose.Schema.Types.ObjectId,
          ref:"Contributions"
          
      }],
});

SchoolrepSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("Schoolrep", SchoolrepSchema);
var mongoose=require("mongoose");
var passportLocalMongoose=require("passport-local-mongoose");

var RoleSchema=new mongoose.Schema({
    
    username:{
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
        },
    role:String
    
    
});
RoleSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("Role", RoleSchema);

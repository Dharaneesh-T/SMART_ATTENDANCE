import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema({

subject:{
type:String,
required:true
},

department:{
type:String,
required:true
},

faculty:{
type:String,
required:true
},

day:{
type:String,
required:true
},

time:{
type:String,
required:true
}

});

export default mongoose.model("Schedule",scheduleSchema);
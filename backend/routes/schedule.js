import express from "express";
import Schedule from "../models/Schedule.js";

const router = express.Router();

/* GET ALL SCHEDULE */

router.get("/",async(req,res)=>{

try{

const schedules = await Schedule.find();

res.json(schedules);

}catch(error){

res.status(500).json({
message:"Error fetching schedules"
});

}

});

/* ADD SCHEDULE */

router.post("/add",async(req,res)=>{

try{

const schedule = new Schedule(req.body);

await schedule.save();

res.json({
message:"Schedule added",
schedule
});

}catch(error){

res.status(500).json({
message:"Error adding schedule"
});

}

});

export default router;
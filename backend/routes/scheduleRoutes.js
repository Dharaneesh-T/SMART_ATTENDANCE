import express from "express";

const router = express.Router();

/* Demo Schedule Data */

const schedules = [
{
_id:"1",
subject:"Java",
department:"CS",
faculty:"Dr. Kumar",
day:"Monday",
time:"10:00 - 11:00"
},
{
_id:"2",
subject:"Python",
department:"IT",
faculty:"Prof. Ravi",
day:"Tuesday",
time:"11:00 - 12:00"
},
{
_id:"3",
subject:"DBMS",
department:"BCA",
faculty:"Dr. Meena",
day:"Wednesday",
time:"09:00 - 10:00"
},
{
_id:"4",
subject:"AI",
department:"CS",
faculty:"Dr. Arun",
day:"Thursday",
time:"01:00 - 02:00"
}
];

router.get("/", (req,res)=>{
res.json(schedules);
});

export default router;
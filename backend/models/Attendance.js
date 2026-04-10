import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({

  studentId: {
    type: String,
    required: true
  },

  subject: {
    type: String,
    required: true
  },

  date: {
    type: Date,
    required: true
  },

  status: {
    type: String,
    enum: ["Present", "Absent"],
    required: true
  }

});

export default mongoose.model("Attendance", attendanceSchema);
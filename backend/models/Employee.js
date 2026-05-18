import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  department: { type: String, required: true },
  skills: [{ type: String }],
  performanceScore: { type: Number, required: true },
  experience: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Employee = mongoose.model("Employee", employeeSchema);
export default Employee;

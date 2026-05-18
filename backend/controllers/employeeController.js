import Employee from "../models/Employee.js";

export const addEmployee = async (req, res) => {
    try {
        const { name, email, department, skills, performanceScore, experience } = req.body;
        
        if (!name || !email || !department || !skills || performanceScore === undefined || experience === undefined) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingEmployee = await Employee.findOne({ email });
        if (existingEmployee) {
            return res.status(400).json({ message: "Employee with this email already exists" });
        }
        
        const employee = await Employee.create({
            name,
            email,
            department,
            skills,
            performanceScore,
            experience
        });
        
        res.status(201).json(employee);
    } catch (error) {
        res.status(500).json({ message: "Failed to add employee", error: error.message });
    }
};

export const getEmployees = async (req, res) => {
    try {
        const employees = await Employee.find();
        res.status(200).json(employees);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch employees", error: error.message });
    }
};

export const searchEmployees = async (req, res) => {
    try {
        const { department, minScore, skills } = req.query;
        let query = {};
        
        if (department) {
            query.department = { $regex: department, $options: "i" };
        }
        
        if (minScore) {
            query.performanceScore = { $gte: Number(minScore) };
        }
        
        if (skills) {
            const skillsArray = skills.split(",").map(skill => skill.trim());
            query.skills = { $in: skillsArray.map(s => new RegExp(s, "i")) }; // Case insensitive matching for skills
        }
        
        const employees = await Employee.find(query);
        res.status(200).json(employees);
    } catch (error) {
        res.status(500).json({ message: "Failed to search employees", error: error.message });
    }
};

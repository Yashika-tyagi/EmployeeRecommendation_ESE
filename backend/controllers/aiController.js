import axios from "axios";
import Employee from "../models/Employee.js";

export const getRecommendation = async (req, res) => {
    try {
        const { employeeId } = req.body;
        
        if (!employeeId) {
            return res.status(400).json({ message: "Employee ID is required" });
        }

        const employee = await Employee.findById(employeeId);
        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }
        
        const prompt = `
Employee:
Name: ${employee.name}
Department: ${employee.department}
Skills: ${employee.skills.join(", ")}
Performance Score: ${employee.performanceScore}
Experience: ${employee.experience} years

Analyze this employee and provide:
1. Promotion recommendation
2. Skill improvement suggestions
3. Training recommendations
4. Overall feedback
`;

        try {
            const response = await axios.post(
              "https://openrouter.ai/api/v1/chat/completions",
              {
                model: "google/gemma-3-27b-it:free",
                messages: [
                  {
                    role: "user",
                    content: prompt
                  }
                ]
              },
              {
                headers: {
                  Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                  "Content-Type": "application/json"
                }
              }
            );

            const aiContent = response?.data?.choices?.[0]?.message?.content;

            if (!aiContent || typeof aiContent !== "string") {
              return res.status(500).json({
                error: "AI returned invalid response",
                rawResponse: response.data
              });
            }

            res.status(200).json({ recommendation: aiContent });

        } catch (apiError) {
            console.error("OpenRouter API Error:", apiError.response?.data || apiError.message);
            return res.status(200).json({
                recommendation: "### Fallback Recommendation\nDue to high traffic or service limitations, a detailed AI analysis cannot be generated at this moment.\n\n**General Advice:**\n- Based on the employee's score of " + employee.performanceScore + ", continue to monitor their progress.\n- Encourage upskilling in their core domain.\n- Provide opportunities for mentorship.",
                debug: apiError.response?.data || apiError.message
            });
        }

    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

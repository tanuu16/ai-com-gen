import { GoogleGenAI } from "@google/genai";

export default async function handler(req, res) {
  try {
    const { prompt, frameWork } = req.body;

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
You are an experienced programmer with expertise in web development and UI/UX design.

Now, generate a UI component for: ${prompt}
Framework to use: ${frameWork || "Not selected"}

Requirements:  
- The code must be clean, well-structured, and easy to understand.  
- Optimize for SEO where applicable.  
- Focus on creating a modern, animated, and responsive UI design.  
- Include high-quality hover effects, shadows, animations, colors, and typography.  
- Return ONLY the code, formatted properly in **Markdown fenced code blocks**.  
- Do NOT include explanations, text, comments, or anything else besides the code.  
- And give the whole code in a single HTML file.
      `,
    });

    res.status(200).json({
      code: response.text
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
}
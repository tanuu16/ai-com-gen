export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { prompt, framework } = req.body;

    const apiKey = process.env.GEMINI_API_KEY?.trim();

    console.log("Gemini key exists:", Boolean(apiKey));
    console.log("Gemini key starts with:", apiKey?.slice(0, 5));

    if (!apiKey) {
      return res.status(500).json({
        error: "GEMINI_API_KEY is missing. Check your .env.local file."
      });
    }

    if (!prompt?.trim()) {
      return res.status(400).json({
        error: "Prompt is required"
      });
    }

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are an experienced web developer and UI/UX designer.

Generate a UI component for: ${prompt}
Framework to use: ${framework || "HTML + Tailwind CSS"}

Requirements:
- Clean, well-structured code
- Modern, responsive UI
- Good hover effects, shadows, colors, typography, and animations
- Return only code
- Return one complete HTML file`
                }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini status:", response.status);
      console.error("Gemini error:", JSON.stringify(data, null, 2));

      return res.status(response.status).json({
        error: data?.error?.message || "Gemini API request failed"
      });
    }

    const generatedText =
      data?.candidates?.[0]?.content?.parts?.[0]?.text;

    return res.status(200).json({
      code: generatedText || ""
    });
  } catch (error) {
    console.error("Gemini API Error:", error);

    return res.status(500).json({
      error: error.message || "Failed to generate code"
    });
  }
}
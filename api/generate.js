export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  try {
    const { prompt, framework } = req.body || {};

    const apiKey = process.env.GEMINI_API_KEY?.trim();

    console.log("Gemini key exists:", Boolean(apiKey));

    if (!apiKey) {
      return res.status(500).json({
        error: "GEMINI_API_KEY is missing. Check your Vercel environment variables.",
      });
    }

    if (!prompt?.trim()) {
      return res.status(400).json({
        error: "Prompt is required",
      });
    }

    let response;

    // Try up to 3 times for temporary Gemini errors
    for (let attempt = 0; attempt < 3; attempt++) {
      response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": apiKey,
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
- Good hover effects
- Good shadows
- Good colors
- Good typography
- Smooth animations
- Return only code
- Return one complete HTML file`,
                  },
                ],
              },
            ],
          }),
        }
      );

      console.log(
        `Gemini attempt ${attempt + 1}: status ${response.status}`
      );

      // If it is NOT a temporary error, don't retry
      if (response.status !== 503 && response.status !== 429) {
        break;
      }

      // If this was the last attempt, don't wait again
      if (attempt < 2) {
        const delay = 1000 * Math.pow(2, attempt);

        console.log(
          `Gemini temporarily unavailable. Retrying in ${delay}ms...`
        );

        await new Promise((resolve) =>
          setTimeout(resolve, delay)
        );
      }
    }

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini status:", response.status);
      console.error(
        "Gemini error:",
        JSON.stringify(data, null, 2)
      );

      return res.status(response.status).json({
        error:
          data?.error?.message ||
          "Gemini API request failed",
      });
    }

    const generatedText =
      data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedText) {
      console.error(
        "No generated text:",
        JSON.stringify(data, null, 2)
      );

      return res.status(500).json({
        error: "Gemini returned no generated code",
      });
    }

    return res.status(200).json({
      code: generatedText,
    });

  } catch (error) {
    console.error("Gemini API Error:", error);

    return res.status(500).json({
      error:
        error?.message ||
        "Failed to generate code",
    });
  }
}
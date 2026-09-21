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
        error: "GEMINI_API_KEY is missing.",
      });
    }

    if (!prompt?.trim()) {
      return res.status(400).json({
        error: "Prompt is required",
      });
    }

    const models = [
      "gemini-3.8-flash",
      "gemini-3.7-flash",
      "gemini-3.6-flash",
      "gemini-3.5-flash-lite",
    ];

    let lastError = null;

    for (const model of models) {
      console.log(`Trying Gemini model: ${model}`);

      for (let attempt = 0; attempt < 2; attempt++) {
        try {
        const response = await fetch(
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent",
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

          const data = await response.json();

          console.log(
            `${model} attempt ${attempt + 1}: ${response.status}`
          );

          // SUCCESS
          if (response.ok) {
            const generatedText =
              data?.candidates?.[0]?.content?.parts?.[0]?.text;

            if (!generatedText) {
              return res.status(500).json({
                error: "Gemini returned no generated code.",
              });
            }

            console.log(`Success using ${model}`);

            return res.status(200).json({
              code: generatedText,
            });
          }

          // Temporary error → retry
          if (response.status === 503 || response.status === 429) {
            lastError =
              data?.error?.message ||
              `Gemini returned ${response.status}`;

            if (attempt === 0) {
              console.log(
                `${model} temporarily unavailable. Retrying...`
              );

              await new Promise((resolve) =>
                setTimeout(resolve, 1500)
              );

              continue;
            }

            // Both attempts failed → move to next model
            console.log(
              `${model} unavailable. Trying next model...`
            );

            break;
          }

          // Permanent error → don't keep trying models
          console.error(
            `Gemini error from ${model}:`,
            JSON.stringify(data, null, 2)
          );

          return res.status(response.status).json({
            error:
              data?.error?.message ||
              "Gemini API request failed",
          });

        } catch (error) {
          lastError = error?.message;

          console.error(
            `Error with ${model}:`,
            error
          );

          // Try next attempt/model
        }
      }
    }

    // All models failed
    console.error(
      "All Gemini models failed:",
      lastError
    );

    return res.status(503).json({
      error:
        "Gemini is temporarily unavailable. Please try again in a few moments.",
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
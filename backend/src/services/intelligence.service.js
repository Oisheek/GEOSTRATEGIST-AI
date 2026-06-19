const axios = require("axios");

async function analyzeRegion(
  regionName,
  news
) {
  try {

    const headlines =
      news
        .slice(0, 10)
        .map(
          (n) =>
            `- ${n.title}`
        )
        .join("\n");

    const prompt = `
You are a senior geopolitical intelligence analyst.

Analyze these headlines for ${regionName}.

Headlines:
${headlines}

Return ONLY valid JSON.

{
  "riskScore": 0,
  "activeConflicts": 0,
  "forecast": {
    "escalation": 0,
    "stability": 0,
    "deEscalation": 0
  },
  "summary": "",
  "threatLevel": "Low"
}

Rules:
- riskScore must be 0-100
- forecast values must total 100
- threatLevel must be Low, Medium, High, or Critical
- output JSON only
`;

    console.log(
      `Generating intelligence for ${regionName}...`
    );

    const response =
      await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model:
          "nvidia/nemotron-3-ultra-550b-a55b:free",

          messages: [
            {
              role: "user",
              content:
                prompt,
            },
          ],

          temperature: 0.3,
        },
        {
          headers: {
            Authorization:
              `Bearer ${process.env.OPENROUTER_API_KEY}`,

            "Content-Type":
              "application/json",
          },
        }
      );

    let content =
      response.data
        .choices?.[0]
        ?.message?.content;

    if (!content) {

      console.log(
        "No AI response"
      );

      return null;
    }

    content =
      content
        .replace(
          /```json/g,
          ""
        )
        .replace(
          /```/g,
          ""
        )
        .trim();

    const start =
      content.indexOf("{");

    const end =
      content.lastIndexOf("}");

    if (
      start === -1 ||
      end === -1
    ) {

      console.log(
        "Invalid JSON response"
      );

      console.log(
        content
      );

      return null;
    }

    const jsonString =
      content.slice(
        start,
        end + 1
      );

    const analysis =
      JSON.parse(
        jsonString
      );

    console.log(
      `${regionName} intelligence generated`
    );

    return analysis;

  } catch (error) {

    console.error(
      "AI Analysis Failed"
    );

    console.error(
      error.response?.data ||
      error.message
    );

    return {
      riskScore: 50,

      activeConflicts: 0,

      forecast: {
        escalation: 33,
        stability: 34,
        deEscalation: 33,
      },

      summary:
        "AI analysis unavailable.",

      threatLevel:
        "Medium",
    };
  }
}

module.exports = {
  analyzeRegion,
};
const axios = require("axios");

async function discoverConflicts(news) {

  try {

    const headlines =
      news
        .slice(0, 50)
        .map(
          (n) =>
            `- ${n.title}`
        )
        .join("\n");

    const prompt = `
You are a senior geopolitical intelligence analyst.

Analyze the following real-world news headlines:

${headlines}

TASK:

Identify ALL active geopolitical conflicts, wars, military confrontations,
territorial disputes, insurgencies, proxy wars, border crises,
major security incidents, and strategic military tensions.

IMPORTANT RULES:

- Extract conflicts ONLY from the provided headlines.
- Do NOT invent conflicts that are not supported by the headlines.
- Include conflicts even if they are not full-scale wars.
- Merge duplicate conflicts.
- Return only unique conflicts.
- If multiple headlines refer to the same conflict, return ONE entry.
- Do not create duplicate conflicts with different capitalization.
- Do not create duplicate conflicts with slightly different names.

STANDARD CONFLICT NAMES:

- Russia-Ukraine War
- Israel-Gaza Conflict
- Israel-Lebanon Conflict
- U.S.-Iran Tensions
- Taiwan Strait Tensions
- South China Sea Dispute
- India-Pakistan Tensions
- Sudan Conflict
- Myanmar Civil War
- DR Congo Conflict
- Yemen Conflict
- Syria Conflict
- Armenia-Azerbaijan Tensions
- North Korea-South Korea Tensions

REGIONS:

The region field MUST be one of:

- North America
- South America
- Europe
- Africa
- Middle East
- South Asia
- East Asia
- Oceania

SEVERITY:

- Low
- Medium
- High
- Critical

STATUS:

- Monitoring
- Active
- Escalating
- Resolved

Return ONLY valid JSON.

[
  {
    "name": "",
    "region": "",
    "severity": "Low",
    "status": "Monitoring",
    "summary": "",
    "actors": []
  }
]
`;

    const response =
      await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model:
            "openai/gpt-oss-120b:free",

          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],

          temperature: 0.2,
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

    content =
      content
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

    const conflicts =
      JSON.parse(content);

      const conflictCoordinates = {

        "Russia-Ukraine War": [49, 32],
      
        "Israel-Gaza Conflict": [31.5, 34.5],
      
        "Israel-Lebanon Conflict": [33.8, 35.8],
      
        "U.S.-Iran Tensions": [32, 53],
      
        "Taiwan Strait Tensions": [24, 121],
      
        "Sudan Conflict": [15.5, 32.5],
      
        "India-Pakistan Tensions": [34, 69],
      
        "South China Sea Dispute": [15, 115],
      
        "DR Congo Conflict": [-2, 23],
      
        "Yemen Conflict": [15, 48],
      
        "Syria Conflict": [35, 38],
      
        "Myanmar Civil War": [21, 96],
      
        "Armenia-Azerbaijan Tensions": [40.3, 47.7],
      
        "North Korea-South Korea Tensions": [38, 127]
      };

      return conflicts.map(
        (conflict) => ({
      
          ...conflict,
      
          lat:
            conflictCoordinates[
              conflict.name
            ]?.[0],
      
          lng:
            conflictCoordinates[
              conflict.name
            ]?.[1],
      
        })
      );

  } catch (err) {

    console.error(
      "Conflict Discovery Failed"
    );

    console.error(
      err.response?.data ||
      err.message
    );

    return [];
  }

}

module.exports = {
  discoverConflicts,
};
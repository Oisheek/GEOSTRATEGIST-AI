const axios = require("axios");
const News = require("../../models/News");

async function generateRisk(regionName) {
  try {

    const regionNews =
      await News.find({
        region: regionName,
      })
        .sort({
          publishedAt: -1,
        })
        .limit(20);

        const securityKeywords = [
          "war",
          "conflict",
          "attack",
          "missile",
          "military",
          "strike",
          "terror",
          "terrorism",
          "sanction",
          "nuclear",
          "riot",
          "protest",
          "insurgency",
          "border",
          "drone",
          "drones",
          "security",
          "army",
          "navy",
          "air force",
          "hostage",
          "ceasefire",
          "invasion",
          "troops",
          "rebel",
          "crisis",
          "violence",
          "humanitarian",
        
          // ADD THESE
          "killed",
          "dead",
          "casualties",
          "soldiers",
          "military operation",
          "airstrike",
          "bombing",
          "shelling",
          "offensive",
          "defensive",
          "battle",
          "combat"
        ];
        
        
        const filteredNews =
        regionNews.filter(
          (article) => {
      
            const text = `
              ${article.title || ""}
              ${article.description || ""}
            `.toLowerCase();
      
            return securityKeywords.some(
              keyword =>
                text.includes(keyword)
            );
          }
        );
      
//           let detectedConflicts = 0;

// filteredNews.forEach((article) => {

//   const text = `
//     ${article.title || ""}
//     ${article.description || ""}
//   `.toLowerCase();

//   if (
//     text.includes("war") ||
//     text.includes("conflict") ||
//     text.includes("attack") ||
//     text.includes("missile") ||
//     text.includes("drone") ||
//     text.includes("invasion") ||
//     text.includes("troops") ||
//     text.includes("airstrike")
//   ) {
//     detectedConflicts++;
//   }

// });


          const newsText =
          filteredNews
          .slice(0, 15)
        .map(
          article =>
            `Title: ${article.title || ""}

Description:
${article.description || ""}`
        )
        .join("\n\n");

    if (!newsText.trim()) {

      return {
        riskScore: 25,
        activeConflicts: 0,
        summary:
          `No recent intelligence available for ${regionName}.`,
      };

    }

    const prompt = `
You are a senior geopolitical intelligence analyst working for a global strategic risk monitoring platform.

Analyze the following recent developments from ${regionName}.

${newsText}

IMPORTANT:

Focus ONLY on geopolitical and security-related developments.

IGNORE:
- Sports
- Entertainment
- Celebrity news
- Stock market fluctuations
- Product launches
- Routine business news
- Cultural events
- Weather
- Tourism

PRIORITIZE:
- Wars
- Armed conflicts
- Military operations
- Terrorism
- Border disputes
- Sanctions
- Civil unrest
- Political instability
- Coups
- Insurgencies
- Humanitarian crises
- Refugee crises
- International diplomatic crises
- Nuclear threats
- Maritime security incidents

Risk Score Guide:

0-10 = Extremely stable region with no significant threats.

11-20 = Stable region with only isolated incidents.

21-40 = Low geopolitical tension and limited security concerns.

41-60 = Moderate instability with recurring security or political issues.

61-80 = High risk due to active conflicts, major unrest, or serious regional tensions.

81-100 = Critical risk due to war, widespread violence, military escalation, terrorism, or severe humanitarian crises.

Active Conflict Rules:

- Count ongoing wars as active conflicts.
- Count military campaigns as active conflicts.
- Count civil wars as active conflicts.
- Count insurgencies as active conflicts.
- Count major cross-border military engagements as active conflicts.

Examples:

- Russia-Ukraine War = 1 active conflict
- Israel-Gaza War = 1 active conflict
- Sudan Civil War = 1 active conflict
- Active fighting in Congo = 1 active conflict
- Ongoing military operations in Yemen = 1 active conflict
- Taiwan diplomatic tension only = 0 active conflicts
- Economic sanctions only = 0 active conflicts
- Political disagreements only = 0 active conflicts

If the news clearly mentions an ongoing war, activeConflicts must not be 0.

If active military operations, drone strikes, missile attacks, invasions, or sustained armed clashes are reported, activeConflicts should be at least 1.

If an active war is present, riskScore should generally be above 50.

Determine:

1. riskScore (0-100)
2. activeConflicts (integer)
3. summary (maximum 50 words)

Return ONLY valid JSON.

{
  "riskScore": 0,
  "activeConflicts": 0,
  "summary": ""
}

Rules:
- riskScore must be a NUMBER.
- activeConflicts must be a NUMBER.
- summary must be under 50 words.
- Do NOT use markdown.
- Do NOT use code blocks.
- Do NOT explain your reasoning.
- Output JSON only.
`;

    // console.log(
    //   `\n===== ${regionName} =====`
    // );
    
    // console.log(
    //   newsText.substring(0, 1500)
    // );
    const response =
      await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model:
          "nvidia/nemotron-3-ultra-550b-a55b:free",

          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
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

    const content =
      response.data.choices[0]
        .message.content
        .trim();

    const jsonMatch =
      content.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      throw new Error(
        "No JSON returned by AI"
      );
    }

    const aiData =
      JSON.parse(
        jsonMatch[0]
      );
      console.log(
        `${regionName} AI analysis completed`
      );
      
    return {
      riskScore:
        Number(
          aiData.riskScore
        ) || 50,

      activeConflicts:
        Number(
          aiData.activeConflicts
        ) || 0,

      summary:
        aiData.summary ||
        "Assessment unavailable.",
    };

  } catch (error) {

    console.error(
      "Risk Agent Error:",
      error.message
    );

    return {
      riskScore: 50,
      activeConflicts: 0,
      summary:
        "Unable to generate AI risk assessment.",
    };

  }
}

module.exports =
  generateRisk;
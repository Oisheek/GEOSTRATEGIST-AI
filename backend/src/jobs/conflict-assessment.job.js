const Conflict =
  require("../models/Conflict");

const axios =
  require("axios");

async function analyzeConflict(
  conflict
) {

  try {

    const prompt = `
You are a geopolitical intelligence analyst.

Analyze this conflict:

Name:
${conflict.name}

Region:
${conflict.region}

Severity:
${conflict.severity}

Status:
${conflict.status}

Summary:
${conflict.summary}

Return ONLY valid JSON:

{
  "riskScore": 0,
  "forecast": "",
  "summary": ""
}

Rules:
- riskScore between 0 and 100
- summary under 80 words
- forecast under 80 words
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
              content:
                prompt,
            },
          ],

          temperature:
            0.3,
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

    if (!content)
      return null;

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
      return null;
    }

    return JSON.parse(
      content.slice(
        start,
        end + 1
      )
    );

  } catch (error) {

    console.error(
      `AI failed for ${conflict.name}`
    );

    console.error(
      error.response?.data ||
      error.message
    );

    return null;
  }
}

async function updateConflictAssessments() {

  try {

    console.log(
      "================================="
    );

    console.log(
      "Starting Conflict Intelligence..."
    );

    const conflicts =
      await Conflict.find();

    console.log(
      `Found ${conflicts.length} conflicts`
    );

    for (
      const conflict of conflicts
    ) {

      try {

        console.log(
          `Analyzing ${conflict.name}`
        );

        const analysis =
          await analyzeConflict(
            conflict
          );

        if (
          !analysis
        ) {
          continue;
        }

        conflict.aiRiskScore =
          analysis.riskScore;

        conflict.aiSummary =
          analysis.summary;

        conflict.aiForecast =
          analysis.forecast;

        conflict.lastAnalyzed =
          new Date();

        await conflict.save();

        console.log(
          `Updated ${conflict.name}`
        );

        await new Promise(
          (resolve) =>
            setTimeout(
              resolve,
              5000
            )
        );

      } catch (err) {

        console.error(
          conflict.name
        );

        console.error(
          err
        );

      }
    }

    console.log(
      "Conflict Intelligence Complete"
    );

    console.log(
      "================================="
    );

  } catch (err) {

    console.error(
      "Conflict Assessment Job Failed"
    );

    console.error(err);

  }
}

module.exports =
  updateConflictAssessments;
let openrouter = null;

async function getOpenRouter() {
  if (!openrouter) {
    const { OpenRouter } =
      await import("@openrouter/sdk");

    openrouter = new OpenRouter({
      apiKey:
        process.env.OPENROUTER_API_KEY,
    });
  }

  return openrouter;
}

function sleep(ms) {
  return new Promise((resolve) =>
    setTimeout(resolve, ms)
  );
}

async function callModel(prompt) {
  let retries = 5;

  while (retries > 0) {
    try {
      const client =
        await getOpenRouter();

      const response =
        await client.chat.send({
          chatRequest: {
            model:
              "openai/gpt-oss-120b:free",
            messages: [
              {
                role: "user",
                content: prompt,
              },
            ],
          },
        });

      return response;
    } catch (err) {
      if (err?.statusCode === 429) {
        const retryAfter =
          err?.error?.metadata
            ?.retry_after_seconds || 8;

        console.log(
          `Rate limited. Waiting ${retryAfter}s...`
        );

        await sleep(
          retryAfter * 1000
        );

        retries--;
        continue;
      }

      throw err;
    }
  }

  throw new Error(
    "Max retries exceeded"
  );
}

async function generateAssessment(
  region,
  news
) {
  try {
    const headlines = news
      .slice(0, 10)
      .map(
        (item) => `- ${item.title}`
      )
      .join("\n");

    const prompt = `
You are a geopolitical intelligence analyst.

Region: ${region.name}
Risk Score: ${region.riskScore}
Active Conflicts: ${region.activeConflicts}

Recent Headlines:
${headlines}

Generate:
1. Current regional situation
2. Key threats
3. Risk outlook

Maximum 100 words.
Do not use the phrase "As an AI language model" or similar disclaimers.
Keep the text human like, do not use **,--,or other formatting.
Do not use emojis.
Do not use "The user wants" or similar phrases.
Professional intelligence style.
`;

    console.log(
      `Generating assessment for ${region.name}...`
    );

    const aiResponse =
      await callModel(prompt);

    console.dir(aiResponse, {
      depth: null,
    });

    const content =
      aiResponse?.choices?.[0]
        ?.message?.content ||
      aiResponse?.message?.content ||
      "";

    return (
      content ||
      "Assessment unavailable."
    );
  } catch (error) {
    console.error(
      `Assessment generation failed for ${region.name}:`
    );

    console.error(error);

    return "Assessment unavailable.";
  }
}

module.exports = {
  generateAssessment,
};
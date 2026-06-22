let openrouter = null;

async function getOpenRouter() {
  if (!openrouter) {
    const { OpenRouter } = await import("@openrouter/sdk");
    openrouter = new OpenRouter({
      apiKey: process.env.OPENROUTER_API_KEY,
    });
  }

  return openrouter;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function normalizeErrorMessage(err) {
  return String(
    err?.error?.message ||
      err?.response?.data?.error?.message ||
      err?.message ||
      ""
  ).toLowerCase();
}

function isQuotaExhausted(err) {
  const message = normalizeErrorMessage(err);
  return (
    message.includes("free-models-per-day") ||
    message.includes("daily quota exhausted") ||
    message.includes("quota exhausted")
  );
}

function isRateLimited(err) {
  const message = normalizeErrorMessage(err);
  return (
    err?.statusCode === 429 ||
    err?.response?.status === 429 ||
    String(err?.code) === "429" ||
    message.includes("rate limit") ||
    message.includes("too many requests")
  );
}

function getRetryAfterSeconds(err, fallback = 8) {
  const direct = Number(err?.error?.metadata?.retry_after_seconds);
  if (Number.isFinite(direct) && direct > 0) return direct;

  const headerValue = err?.response?.headers?.["retry-after"];
  const parsedHeader = Number(headerValue);
  if (Number.isFinite(parsedHeader) && parsedHeader > 0) return parsedHeader;

  return fallback;
}

async function callOpenRouterChat({
  model,
  messages,
  temperature = 0.3,
  maxRetries = 2,
}) {
  let attempt = 0;

  while (true) {
    try {
      const client = await getOpenRouter();

      return await client.chat.send({
        chatRequest: {
          model,
          messages,
          temperature,
        },
      });
    } catch (err) {
      if (isQuotaExhausted(err)) {
        const quotaError = new Error(
          "OpenRouter daily free-model quota exhausted"
        );
        quotaError.name = "OpenRouterQuotaError";
        quotaError.isQuotaError = true;
        quotaError.originalError = err;
        throw quotaError;
      }

      if (isRateLimited(err) && attempt < maxRetries) {
        const waitSeconds = getRetryAfterSeconds(err, 8);
        console.log(`Rate limited. Waiting ${waitSeconds}s...`);
        attempt += 1;
        await sleep(waitSeconds * 1000);
        continue;
      }
      const msg =
  String(
    err?.message || ""
  ).toLowerCase();

if (
  msg.includes(
    "provider returned error"
  ) ||
  msg.includes("504")
) {

  console.log(
    "Provider timeout."
  );

  throw new Error(
    "Nemotron timeout"
  );

}
      throw err;
    }
  }
}

function extractContent(response) {
  return (
    response?.choices?.[0]?.message?.content ||
    response?.message?.content ||
    ""
  );
}

module.exports = {
  getOpenRouter,
  callOpenRouterChat,
  extractContent,
  sleep,
  isQuotaExhausted,
};
const Chat = require("../../models/Chat");
const Message = require("../../models/Message");
const { buildContext } = require("../../services/rag.service");

const SYSTEM_PROMPT = `
You are GeoStrategist AI,do not mention your model name owl, an expert geopolitical intelligence analyst.

You help users analyze:

- Global conflicts, wars, and military tensions
- Country-level political, economic, and security risks
- Geopolitical forecasts and scenario planning
- International relations, sanctions, and diplomacy
- Economic indicators and their geopolitical implications

Guidelines:
- All ways mention your name as GeoStrategist AI when introducing yourself, never use your model name OWL Alpha in your responses, only GeoStrategist AI
- Be analytical, factual, and concise
- Cite regions, countries, and actors by name
- Use intelligence data whenever available
- Mention risk scores when relevant
- Mention active conflicts when relevant
- Mention latest developments when relevant
- When uncertain, clearly state uncertainty
- Avoid political bias
- Keep responses under 400 words unless detailed analysis is requested
- NEVER answer questions outside geopolitics, international relations, or global security
- If asked anything unrelated, firmly decline and redirect to your purpose
- Do not provide any code, technical, or personal advice
- Do not answer questions about general knowledge, trivia, or non-geopolitical topics
- If the question is vague, ask for clarification or specify what geopolitical information is needed
- Always maintain a professional and analytical tone, even when discussing sensitive topics
- Never engage in speculation without grounding in intelligence data or established geopolitical knowledge
- Always prioritize accuracy and relevance to geopolitics in your responses
-do not use **markdown** formatting in your responses, just plain text or bold for emphasis
`;

// ─── Firewall ────────────────────────────────────────────────────────────────

const BLOCKED_PATTERNS = [
  // Coding / tech
  /\b(write (a |some )?(code|script|program|function|class|api|sql|query|html|css|javascript|python|java|c\+\+|bash|regex))\b/i,
  /\b(debug|refactor|fix (my |this )?(code|bug|error)|how to (code|program|build an app))\b/i,
  // General knowledge / trivia
  /\b(recipe|cook|bake|ingredient|nutrition|calorie|diet|workout|exercise|gym|yoga|meditat)\b/i,
  /\b(movie|film|series|netflix|spotify|music|song|lyrics|album|celebrity|actor|actress)\b/i,
  /\b(math(ematics)?|algebra|calculus|equation|solve for|what is \d+ (plus|minus|times|divided))\b/i,
  /\b(translate|translation|how (do you say|to say)|what does .+ mean in)\b/i,
  /\b(joke|funny|meme|prank|riddle|story|poem|write me a)\b/i,
  /\b(homework|essay|assignment|thesis|dissertation|school|college|university exam)\b/i,
  // Personal / lifestyle
  /\b(relationship|dating|love|breakup|marriage|divorce|boyfriend|girlfriend|crush)\b/i,
  /\b(mental health|therapy|depression|anxiety|stress relief|feel (better|sad|happy))\b/i,
  /\b(fashion|clothes|outfit|hair(style)?|makeup|beauty|skincare)\b/i,
  /\b(travel (tips|hacks|guide)|best (hotels?|restaurants?|places to visit)|tourist)\b/i,
  // Finance / crypto (non-geopolitical)
  /\b(stock pick|buy (stocks?|bitcoin|ethereum|crypto|nft)|portfolio advice|trading (bot|strategy))\b/i,
  // Jailbreak attempts
  /\b(ignore (previous|all|your) instructions|forget (your|all) (rules|instructions|training)|you are now|pretend (you are|to be)|act as (a |an )?(different|unrestricted|evil|unfiltered))\b/i,
  /\b(jailbreak|dan mode|developer mode|god mode|no (restrictions|limits|rules|filters))\b/i,
];

const GEOPOLITICAL_KEYWORDS = [
  "war", "conflict", "military", "sanction", "nato", "un ", "united nations", "treaty",
  "invasion", "geopolit", "diplomac", "foreign policy", "nuclear", "missile", "troops",
  "territory", "border", "government", "regime", "coup", "election", "dictator", "president",
  "prime minister", "parliament", "insurgency", "terrorism", "intel", "spy", "cia", "nsa",
  "risk", "threat", "security", "alliance", "embargo", "refugee", "humanitarian", "gdp",
  "inflation", "economy", "oil", "energy", "supply chain", "trade war", "tariff",
  "china", "russia", "ukraine", "usa", "israel", "iran", "taiwan", "india", "pakistan",
  "north korea", "south korea", "europe", "africa", "middle east", "asia", "latin america",
  "arctic", "south china sea", "brics", "g7", "g20", "imf", "world bank", "opec",
  "escalat", "ceasefire", "peacekeep", "arms", "weapon", "defence", "defense",
  "forecast", "scenario", "analysis", "assess", "strateg", "region", "country", "nation",
];

const FIREWALL_RESPONSE = `I'm **GeoStrategist AI** — a specialized geopolitical intelligence analyst.

I can only assist with:
• **Global conflicts & military tensions**
• **Country risk assessments**
• **Geopolitical forecasts & scenarios**
• **International relations & diplomacy**
• **Sanctions, trade wars & economic security**

Your question falls outside my scope. Please ask me something related to geopolitics or global security.`;

function isGeopolitical(message) {
  const lower = message.toLowerCase();
  return GEOPOLITICAL_KEYWORDS.some((kw) => lower.includes(kw));
}

function isBlocked(message) {
  return BLOCKED_PATTERNS.some((pattern) => pattern.test(message));
}

function classifyMessage(message) {
  if (isBlocked(message)) return "blocked";
  if (isGeopolitical(message)) return "allowed";
  // Short/vague messages (greetings, etc.) — let AI handle them
  if (message.trim().split(/\s+/).length <= 6) return "allowed";
  return "offtopic";
}

// ─── AI Call ─────────────────────────────────────────────────────────────────

async function callOpenRouter(messages) {
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "openrouter/owl-alpha",
      messages,
      max_tokens: 700,
      temperature: 0.4,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`OpenRouter error ${response.status}: ${err}`);
  }

  const data = await response.json();
  return data?.choices?.[0]?.message?.content || "Unable to generate a response.";
}

// ─── Main export ─────────────────────────────────────────────────────────────

async function sendMessage(chatId, userId, userContent) {
  const chat = await Chat.findOne({ _id: chatId, userId });
  if (!chat) throw new Error("Chat not found");

  // Save user message
  await Message.create({ chatId, role: "user", content: userContent });

  // Run firewall check
  const verdict = classifyMessage(userContent);
  let aiContent;

  if (verdict === "blocked" || verdict === "offtopic") {
    console.log(`[Firewall] Blocked: "${userContent.slice(0, 80)}"`);
    aiContent = FIREWALL_RESPONSE;
  } else {
    // Fetch last 10 messages for context
    const history = await Message.find({ chatId })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    const intelligenceContext = await buildContext();

    const contextMessages = [
      {
        role: "system",
        content: `
${SYSTEM_PROMPT}

LIVE GEOPOLITICAL INTELLIGENCE

${intelligenceContext}

Answer using the intelligence data whenever possible.

If the answer is not present in the intelligence data,
combine geopolitical knowledge with the latest available context.

Do not invent facts.
`,
      },
      ...history.reverse().map((m) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.content,
      })),
    ];

    const start = Date.now();
    aiContent = await callOpenRouter(contextMessages);
    console.log(`[Chat] Response in ${Date.now() - start}ms`);
  }

  // Save assistant message
  const assistantMessage = await Message.create({
    chatId,
    role: "assistant",
    content: aiContent,
    metadata: { model: "openrouter/owl-alpha" },
  });

  // Update chat metadata
  chat.messageCount = (chat.messageCount || 0) + 2;
  chat.lastMessage = userContent.slice(0, 100);
  if (chat.title === "New Chat" && userContent.length > 0) {
    chat.title = userContent.slice(0, 50) + (userContent.length > 50 ? "..." : "");
  }
  await chat.save();

  return assistantMessage;
}

module.exports = { sendMessage };
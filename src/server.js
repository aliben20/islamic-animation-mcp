import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

const SAFETY = [
  "Do not depict Prophets or sacred figures.",
  "Do not fabricate Qur'an, hadith, religious rulings, or historical claims.",
  "Do not generate Qur'anic text or calligraphy inside images; typeset verified text in post-production.",
  "Refer sensitive religious claims to qualified human review.",
  "Publishing requires explicit approval of the exact final rendered video."
];

function storyboard({ topic, duration, language, audience, platform }) {
  const d = Number(duration);
  const scenes = [
    { time: "0-6s", title: "The moment", visual: "A person notices someone who needs help; warm cinematic establishing shot.", narration: language === "ar" ? "أحيانًا، أبسط تصرّف يصنع فرقًا كبيرًا." : "Sometimes, the smallest act can make the biggest difference." },
    { time: "6-17s", title: "The choice", visual: "Close-up: a brief hesitation, then a kind and welcoming gesture.", narration: language === "ar" ? "نختار اللطف، حتى عندما لا يطلبه أحد." : "Choose kindness, even when nobody asks for it." },
    { time: "17-30s", title: "The action", visual: "The person offers practical help; natural expressions, gentle camera movement.", narration: language === "ar" ? "مساعدة صادقة، كلمة طيبة، وابتسامة من القلب." : "A sincere helping hand, a kind word, and a heartfelt smile." },
    { time: "30-40s", title: "The ripple", visual: "The kindness inspires another person to help; uplifting wide shot.", narration: language === "ar" ? "فالخير ينتقل من قلبٍ إلى قلب." : "Goodness travels from one heart to another." },
    { time: "40-45s", title: "The message", visual: "Soft golden light, calm closing frame, clean space for typeset title.", narration: language === "ar" ? "كن سببًا في جبر خاطرٍ اليوم." : "Be the reason someone feels cared for today." }
  ];
  return { topic, duration: d, language, audience, platform, aspectRatio: "9:16", style: "premium cinematic 3D animation", scenes, safety: SAFETY, note: "Illustrative creative draft; verify any religious quotation or claim before production." };
}

export function buildServer() {
  const server = new McpServer({ name: "islamic-animation-mcp", version: "1.3.0" });
  server.tool("islamic_animation_plan", "Create a scene-by-scene Islamic animation plan with safety constraints.", {
    topic: z.string().min(2),
    duration: z.number().int().min(10).max(180).default(45),
    language: z.enum(["ar", "en", "ar-en"]).default("ar"),
    audience: z.string().default("general audience"),
    platform: z.enum(["tiktok", "reels", "shorts", "youtube"]).default("tiktok")
  }, async (args) => ({ content: [{ type: "text", text: JSON.stringify(storyboard(args), null, 2) }] }));

  server.tool("islamic_content_safety_review", "Review an animation brief for religious-content risks and required human checks.", {
    script: z.string(),
    includesReligiousClaims: z.boolean().default(false),
    includesQuranOrHadith: z.boolean().default(false),
    depictsSacredFigures: z.boolean().default(false),
    requestsGeneratedArabicCalligraphy: z.boolean().default(false)
  }, async (a) => {
    const issues = [];
    if (a.depictsSacredFigures) issues.push("Remove depictions of Prophets or sacred figures.");
    if (a.includesReligiousClaims) issues.push("Have a qualified reviewer verify religious claims.");
    if (a.includesQuranOrHadith) issues.push("Verify exact source and wording; do not fabricate quotations.");
    if (a.requestsGeneratedArabicCalligraphy) issues.push("Do not generate Qur'anic text/calligraphy in images; typeset verified text in post.");
    return { content: [{ type: "text", text: JSON.stringify({ status: issues.length ? "needs_review" : "basic_checks_passed", issues, alwaysRequired: SAFETY, scriptLength: a.script.length, publishing: "blocked until exact final video is explicitly approved" }, null, 2) }] };
  });

  server.tool("islamic_video_shot_prompts", "Turn a story idea into production-ready visual prompts for individual shots.", {
    topic: z.string(),
    style: z.string().default("premium cinematic 3D animation"),
    language: z.enum(["ar", "en", "ar-en"]).default("ar"),
    shotCount: z.number().int().min(3).max(12).default(5)
  }, async ({ topic, style, language, shotCount }) => {
    const prompts = Array.from({ length: shotCount }, (_, i) => ({
      shot: i + 1,
      prompt: `${style}; vertical 9:16; scene ${i + 1} of a coherent short film about ${topic}; expressive but respectful human characters; motivated camera movement; cinematic lighting; clear readable action; maintain character, wardrobe, location and color continuity; no sacred figures, no generated Arabic text, no logos or watermark.`,
      narrationLanguage: language
    }));
    return { content: [{ type: "text", text: JSON.stringify({ prompts, productionNote: "Generate each shot separately and assemble after review." }, null, 2) }] };
  });

  server.tool("publishing_approval_check", "Check whether a proposed publishing action has explicit approval of the exact final video.", {
    exactVideoApproved: z.boolean(),
    destination: z.string(),
    caption: z.string().optional()
  }, async ({ exactVideoApproved, destination, caption }) => ({
    content: [{ type: "text", text: JSON.stringify({ allowed: exactVideoApproved, destination, caption: caption ?? "", reason: exactVideoApproved ? "Approval flag supplied; confirm the file and destination match the user's approval." : "Blocked: obtain explicit approval of the exact final rendered video before publishing." }) }]
  }));
  return server;
}

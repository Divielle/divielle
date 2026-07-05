import { z } from "zod";
import { publicProcedure, router } from "./_core/trpc";
import { invokeLLM } from "./_core/llm";
import { notifyOwner } from "./_core/notification";

const DIVIELLE_SYSTEM_PROMPT = `You are the DIVIELLE luxury cosmetics brand assistant. You are embedded on the official DIVIELLE website — an experimental, art-driven luxury cosmetics brand.

ABOUT DIVIELLE:
- DIVIELLE is an ultra-luxury cosmetics brand based in Athens, Greece
- The brand philosophy centers on artistry, self-expression, and the intersection of beauty and art
- DIVIELLE currently offers exactly 4 product series:
  1. Lipstick Series — Bold color, lasting elegance (available in Matte, Satin, and Gloss finishes)
  2. Lip Gloss Series — Mirror-shine brilliance (High Shine, Hydrating formulas)
  3. Palette Series — Curated color stories (Eyes, Face, Multi-use)
  4. Brushes Series — Precision artistry tools (Professional grade, Vegan)
- Products feature premium ingredients: hyaluronic acid, vitamin E, jojoba oil, shea butter, and rare botanical extracts
- The brand is cruelty-free and uses sustainable packaging
- Price range: Premium luxury segment
- Contact email: info@divielle.com
- The website features a Classic mode (bright with cold details) and Nights mode (dark with gold details)
- The website is an experimental digital experience featuring 3D art, interactive shade exploration, and cinematic storytelling

YOUR BEHAVIOR:
- Answer questions about DIVIELLE products, collections, ingredients, brand philosophy, shipping, returns, and the website experience
- Be warm, sophisticated, and concise — match the luxury brand voice
- Keep responses brief (2-4 sentences max) unless the user asks for detail
- If asked about specific product availability, pricing details, or order status, let them know you can connect them with the team
- For questions about shade recommendations, be enthusiastic and helpful

ESCALATION RULES:
If the user asks about ANY of the following, you MUST respond with EXACTLY the text "[ESCALATE]" at the very beginning of your message, followed by a brief explanation:
- Anything completely unrelated to DIVIELLE, cosmetics, beauty, or the website
- Specific order tracking or account issues
- Complaints or issues requiring human intervention
- Partnership or business inquiries
- Press or media requests
- Anything you genuinely cannot help with

When escalating, start your response with "[ESCALATE]" then explain briefly why you're connecting them with the team.`;

export const chatbotRouter = router({
  chat: publicProcedure
    .input(
      z.object({
        messages: z.array(
          z.object({
            role: z.enum(["user", "assistant"]),
            content: z.string(),
          })
        ),
      })
    )
    .mutation(async ({ input }) => {
      const llmMessages = [
        { role: "system" as const, content: DIVIELLE_SYSTEM_PROMPT },
        ...input.messages.map((m: { role: string; content: string }) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        })),
      ];

      const result = await invokeLLM({
        messages: llmMessages,
        maxTokens: 300,
      });

      const content =
        result.choices[0]?.message?.content ?? "I apologize, I'm having trouble responding right now.";
      
      const responseText = typeof content === "string" ? content : "";
      const shouldEscalate = responseText.startsWith("[ESCALATE]");
      const cleanResponse = shouldEscalate
        ? responseText.replace("[ESCALATE]", "").trim()
        : responseText;

      return {
        response: cleanResponse,
        shouldEscalate,
      };
    }),

  submitInquiry: publicProcedure
    .input(
      z.object({
        name: z.string().min(1, "Name is required"),
        email: z.string().email("Valid email is required"),
        inquiry: z.string().min(1, "Inquiry is required"),
        chatHistory: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const title = `New Customer Inquiry from ${input.name}`;
      const content = [
        `**Name:** ${input.name}`,
        `**Email:** ${input.email}`,
        `**Inquiry:** ${input.inquiry}`,
        input.chatHistory
          ? `\n**Chat History:**\n${input.chatHistory}`
          : "",
      ]
        .filter(Boolean)
        .join("\n");

      const sent = await notifyOwner({ title, content });

      return {
        success: sent,
        message: sent
          ? "Your inquiry has been sent to our team. We'll get back to you soon."
          : "We couldn't send your inquiry right now. Please email us directly at info@divielle.com.",
      };
    }),
});

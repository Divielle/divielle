import { describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock the LLM module
vi.mock("./_core/llm", () => ({
  invokeLLM: vi.fn().mockResolvedValue({
    id: "mock-id",
    created: Date.now(),
    model: "mock-model",
    choices: [
      {
        index: 0,
        message: {
          role: "assistant",
          content:
            "DIVIELLE offers five signature collections including Velvet Noir and Rose Gold. Each features premium ingredients for a luxurious experience.",
        },
        finish_reason: "stop",
      },
    ],
    usage: { prompt_tokens: 100, completion_tokens: 50, total_tokens: 150 },
  }),
}));

// Mock the notification module
vi.mock("./_core/notification", () => ({
  notifyOwner: vi.fn().mockResolvedValue(true),
}));

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

describe("chatbot.chat", () => {
  it("returns a response for brand-related questions", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.chatbot.chat({
      messages: [{ role: "user", content: "Tell me about your collections" }],
    });

    expect(result).toHaveProperty("response");
    expect(result).toHaveProperty("shouldEscalate");
    expect(typeof result.response).toBe("string");
    expect(result.response.length).toBeGreaterThan(0);
    expect(result.shouldEscalate).toBe(false);
  });

  it("detects escalation when LLM returns [ESCALATE] prefix", async () => {
    const { invokeLLM } = await import("./_core/llm");
    const mockedInvokeLLM = vi.mocked(invokeLLM);

    mockedInvokeLLM.mockResolvedValueOnce({
      id: "mock-id",
      created: Date.now(),
      model: "mock-model",
      choices: [
        {
          index: 0,
          message: {
            role: "assistant",
            content:
              "[ESCALATE] I'd be happy to connect you with our team for this business inquiry.",
          },
          finish_reason: "stop",
        },
      ],
      usage: { prompt_tokens: 100, completion_tokens: 30, total_tokens: 130 },
    });

    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.chatbot.chat({
      messages: [
        { role: "user", content: "I want to discuss a partnership deal" },
      ],
    });

    expect(result.shouldEscalate).toBe(true);
    expect(result.response).not.toContain("[ESCALATE]");
    expect(result.response).toContain("connect you with our team");
  });
});

describe("chatbot.chat - escalation for unrelated topics", () => {
  it("escalates when user asks about unrelated topics like weather", async () => {
    const { invokeLLM } = await import("./_core/llm");
    const mockedInvokeLLM = vi.mocked(invokeLLM);

    mockedInvokeLLM.mockResolvedValueOnce({
      id: "mock-id",
      created: Date.now(),
      model: "mock-model",
      choices: [
        {
          index: 0,
          message: {
            role: "assistant",
            content:
              "[ESCALATE] I'm specifically here to help with DIVIELLE cosmetics. Let me connect you with our team for other inquiries.",
          },
          finish_reason: "stop",
        },
      ],
      usage: { prompt_tokens: 100, completion_tokens: 30, total_tokens: 130 },
    });

    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.chatbot.chat({
      messages: [{ role: "user", content: "What is the weather in Paris today?" }],
    });

    expect(result.shouldEscalate).toBe(true);
    expect(result.response).not.toContain("[ESCALATE]");
    expect(result.response).toContain("DIVIELLE");
  });
});

describe("chatbot.submitInquiry", () => {
  it("sends inquiry notification and returns success", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.chatbot.submitInquiry({
      name: "Jane Doe",
      email: "jane@example.com",
      inquiry: "I'd like to discuss a wholesale partnership.",
      chatHistory: "Customer: Hello\nBot: Welcome to Divielle.",
    });

    expect(result.success).toBe(true);
    expect(result.message).toContain("sent to our team");
  });

  it("validates required fields", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.chatbot.submitInquiry({
        name: "",
        email: "jane@example.com",
        inquiry: "Test",
      })
    ).rejects.toThrow();
  });

  it("validates email format", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.chatbot.submitInquiry({
        name: "Jane",
        email: "not-an-email",
        inquiry: "Test",
      })
    ).rejects.toThrow();
  });
});

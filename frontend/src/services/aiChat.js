// AI Chat Service - uses backend proxy
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export class AIChatService {
  constructor() {
    this.conversationHistory = [];
    this.currentContext = null;
  }

  setContext(context) {
    this.currentContext = context;
  }

  buildSystemPrompt() {
    if (!this.currentContext) {
      return "You are a helpful hardware programming tutor for ESP32 microcontrollers.";
    }

    const { lesson, currentStep, userCode, expectedCode } = this.currentContext;

    return `You are an expert ESP32 hardware programming tutor.

CURRENT LESSON: ${lesson?.title || 'Unknown'}
CURRENT STEP: ${currentStep?.title || 'Unknown'}

${userCode ? `USER'S CODE:\n${userCode}\n` : ''}
${expectedCode ? `EXPECTED CODE:\n${expectedCode}\n` : ''}

Guide users through ESP32 programming. Be encouraging and educational.`;
  }

  async sendMessage(userMessage) {
    this.conversationHistory.push({
      role: 'user',
      content: userMessage
    });

    try {
      const response = await fetch(`${API_URL}/api/ai-chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system: this.buildSystemPrompt(),
          messages: this.conversationHistory
        })
      });

      if (!response.ok) {
        throw new Error(`AI chat failed: ${response.status}`);
      }

      const data = await response.json();
      const assistantMessage = data.message;

      this.conversationHistory.push({
        role: 'assistant',
        content: assistantMessage
      });

      return assistantMessage;
    } catch (error) {
      console.error('AI Chat Error:', error);
      throw new Error(`Failed to get AI response: ${error.message}`);
    }
  }

  clearHistory() {
    this.conversationHistory = [];
  }
}

export const aiChatService = new AIChatService();

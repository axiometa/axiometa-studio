// AI Chat Service using Anthropic Claude API
// This service provides context-aware assistance for the learning platform

const API_ENDPOINT = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-sonnet-4-20250514';

export class AIChatService {
  constructor() {
    this.conversationHistory = [];
    this.currentContext = null;
  }

  setContext(context) {
    // Context includes: lesson, currentStep, userCode, expectedCode, wiring
    this.currentContext = context;
  }

  buildSystemPrompt() {
    if (!this.currentContext) {
      return "You are a helpful hardware programming tutor for ESP32 microcontrollers.";
    }

    const { lesson, currentStep, userCode, expectedCode, wiringComplete } = this.currentContext;

    return `You are an expert ESP32 hardware programming tutor integrated into an interactive learning platform called Axiometa Studio.

CURRENT LESSON CONTEXT:
- Lesson: ${lesson?.title || 'Unknown'}
- Current Step: ${currentStep?.title || 'Unknown'}
- Step Type: ${currentStep?.type || 'Unknown'}
- Board: ${lesson?.board || 'pixie-m1'}

${userCode ? `USER'S CURRENT CODE:
\`\`\`cpp
${userCode}
\`\`\`
` : ''}

${expectedCode ? `EXPECTED/REFERENCE CODE:
\`\`\`cpp
${expectedCode}
\`\`\`
` : ''}

${currentStep?.instruction ? `CURRENT INSTRUCTION: ${currentStep.instruction}` : ''}

${wiringComplete ? 'The hardware wiring is complete.' : 'The user is still setting up the hardware.'}

YOUR ROLE:
- Guide users through ESP32 programming concepts
- Help debug their code by comparing it to the reference
- Explain hardware concepts (pinMode, digitalWrite, delay, etc.)
- Be encouraging and educational
- Keep responses concise and focused on the current lesson
- Never just give the answer - guide them to understand

IMPORTANT:
- If they ask about their code, analyze what they have vs what's expected
- Point out syntax errors, logic issues, or missing components
- If they're stuck, provide hints rather than complete solutions
- Relate everything back to the hardware they're controlling
- Use simple, beginner-friendly language`;
  }

  async sendMessage(userMessage) {
    // Add user message to history
    this.conversationHistory.push({
      role: 'user',
      content: userMessage
    });

    try {
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: MODEL,
          max_tokens: 1000,
          system: this.buildSystemPrompt(),
          messages: this.conversationHistory
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      const assistantMessage = data.content[0].text;

      // Add assistant response to history
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

  // Get a quick code analysis without chat history
  async analyzeCode(userCode, expectedCode, stepInstruction) {
    try {
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: MODEL,
          max_tokens: 500,
          messages: [{
            role: 'user',
            content: `Compare this ESP32 code to the expected solution and provide brief feedback:

USER CODE:
\`\`\`cpp
${userCode}
\`\`\`

EXPECTED CODE:
\`\`\`cpp
${expectedCode}
\`\`\`

INSTRUCTION: ${stepInstruction}

Provide: 1) What's correct, 2) What needs fixing (if anything), 3) One helpful hint.`
          }]
        })
      });

      const data = await response.json();
      return data.content[0].text;
    } catch (error) {
      console.error('Code analysis error:', error);
      return null;
    }
  }
}

export const aiChatService = new AIChatService();
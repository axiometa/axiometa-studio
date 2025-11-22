import React, { useState, useEffect, useRef } from 'react';
import { aiChatService } from '../services/aiChat';

export default function AIAssistant({ lesson, currentStep, userCode, isVisible, onClose, validationError }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (lesson && currentStep) {
      const expectedCode = currentStep.code || 
        lesson.steps.find(s => s.type === 'upload' || s.type === 'code-explanation')?.code;
      
      aiChatService.setContext({
        lesson,
        currentStep,
        userCode,
        expectedCode,
        wiringComplete: currentStep.type !== 'wiring-step'
      });
    }
  }, [lesson, currentStep, userCode]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isVisible && messages.length === 0 && currentStep) {
      setMessages([{
        role: 'assistant',
        content: `👋 Hi! I'm your AI tutor for this lesson. I can see you're working on "${currentStep.title}". Ask me anything about the code, wiring, or concepts!`
      }]);
    }
  }, [isVisible, currentStep]);

  // NEW: Handle validation errors
  useEffect(() => {
    if (validationError) {
      const errorMessage = `⚠️ **I found an issue in your code!**\n\n${validationError}\n\n💡 **Next steps:** Fix the issue in your code editor and try uploading again. If you're stuck, feel free to ask me for help!`;
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: errorMessage
      }]);
    }
  }, [validationError]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await aiChatService.sendMessage(userMessage);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `❌ Sorry, I encountered an error: ${error.message}. Please try again.` 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickQuestions = [
    "What does this code do?",
    "Why isn't my LED working?",
    "Explain digitalWrite()",
    "What does delay() do?"
  ];

  if (!isVisible) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.panel}>
        <div style={styles.header}>
          <div style={styles.headerTitle}>
            <span style={styles.aiIcon}>🤖</span>
            <div>
              <h3 style={styles.title}>AI Tutor</h3>
              <p style={styles.subtitle}>Claude Sonnet 4.5</p>
            </div>
          </div>
          <button style={styles.closeButton} onClick={onClose}>✕</button>
        </div>

        <div style={styles.context}>
          <div style={styles.contextItem}>
            📚 <strong>{lesson?.title}</strong>
          </div>
          <div style={styles.contextItem}>
            📍 Step: {currentStep?.title}
          </div>
          {userCode && (
            <div style={styles.contextItem}>
              💻 Tracking your code
            </div>
          )}
        </div>

        <div style={styles.messages}>
          {messages.map((msg, i) => (
            <div 
              key={i} 
              style={msg.role === 'user' ? styles.userMessageContainer : styles.assistantMessageContainer}
            >
              <div style={msg.role === 'user' ? styles.userMessageContent : styles.assistantMessageContent}>
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div style={styles.assistantMessageContainer}>
              <div style={styles.assistantMessageContent}>
                <span style={styles.typing}>Thinking...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {messages.length <= 1 && (
          <div style={styles.quickQuestions}>
            <div style={styles.quickQuestionsLabel}>Quick questions:</div>
            {quickQuestions.map((q, i) => (
              <button
                key={i}
                style={styles.quickQuestionButton}
                onClick={() => setInput(q)}
              >
                {q}
              </button>
            ))}
          </div>
        )}

        <div style={styles.inputContainer}>
          <input
            type="text"
            style={styles.input}
            placeholder="Ask me anything about this lesson..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            disabled={isLoading}
          />
          <button 
            style={styles.sendButton}
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    maxWidth: '450px',
    background: 'rgba(10, 10, 10, 0.98)',
    backdropFilter: 'blur(10px)',
    borderLeft: '1px solid rgba(0, 255, 136, 0.3)',
    display: 'flex',
    flexDirection: 'column',
    zIndex: 1000,
    fontFamily: 'DM Sans, sans-serif',
  },
  panel: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.5rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  },
  headerTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  aiIcon: {
    fontSize: '2rem',
  },
  title: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: '#00ff88',
    margin: 0,
  },
  subtitle: {
    fontSize: '0.75rem',
    color: '#888',
    margin: 0,
  },
  closeButton: {
    background: 'none',
    border: 'none',
    color: '#888',
    fontSize: '1.5rem',
    cursor: 'pointer',
    padding: '0.5rem',
    lineHeight: 1,
  },
  context: {
    padding: '1rem 1.5rem',
    background: 'rgba(0, 255, 136, 0.05)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  },
  contextItem: {
    fontSize: '0.875rem',
    color: '#ccc',
    marginBottom: '0.5rem',
  },
  messages: {
    flex: 1,
    overflowY: 'auto',
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  userMessageContainer: {
    alignSelf: 'flex-end',
    maxWidth: '80%',
  },
  assistantMessageContainer: {
    alignSelf: 'flex-start',
    maxWidth: '85%',
  },
  userMessageContent: {
    padding: '0.75rem 1rem',
    borderRadius: '12px',
    lineHeight: '1.6',
    fontSize: '0.95rem',
    whiteSpace: 'pre-wrap',
    background: 'linear-gradient(135deg, #00ff88, #00ccff)',
    color: '#000',
  },
  assistantMessageContent: {
    padding: '0.75rem 1rem',
    borderRadius: '12px',
    lineHeight: '1.6',
    fontSize: '0.95rem',
    whiteSpace: 'pre-wrap',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    color: '#fff',
  },
  typing: {
    color: '#888',
    fontStyle: 'italic',
  },
  quickActions: {
    padding: '0 1.5rem 1rem 1.5rem',
  },
  analyzeButton: {
    width: '100%',
    background: 'linear-gradient(90deg, #8a2be2, #9370db)',
    border: 'none',
    color: '#fff',
    padding: '0.75rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '0.95rem',
    fontFamily: 'DM Sans',
  },
  quickQuestions: {
    padding: '0 1.5rem 1rem 1.5rem',
  },
  quickQuestionsLabel: {
    fontSize: '0.875rem',
    color: '#888',
    marginBottom: '0.5rem',
  },
  quickQuestionButton: {
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    color: '#ccc',
    padding: '0.5rem 0.75rem',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.875rem',
    marginRight: '0.5rem',
    marginBottom: '0.5rem',
    fontFamily: 'DM Sans',
  },
  inputContainer: {
    display: 'flex',
    gap: '0.75rem',
    padding: '1.5rem',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
  },
  input: {
    flex: 1,
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    padding: '0.75rem',
    color: '#fff',
    fontSize: '0.95rem',
    fontFamily: 'DM Sans',
  },
  sendButton: {
    background: 'linear-gradient(90deg, #00ff88, #00ccff)',
    border: 'none',
    color: '#000',
    padding: '0.75rem 1.5rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '0.95rem',
    fontFamily: 'DM Sans',
  },
};
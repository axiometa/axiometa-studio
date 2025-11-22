import React, { useState, useEffect, useRef } from 'react';
import { aiChatService } from '../services/aiChat';

export default function AIAssistant({ lesson, currentStep, userCode, validationError }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (lesson && currentStep) {
      const expectedCode = currentStep.code || 
        lesson.steps.find(s => s.type === 'upload' || s.type === 'code-explanation')?.code;
      
      aiChatService.setContext({
        lesson,
        currentStep,
        userCode,
        expectedCode
      });
    }
  }, [lesson, currentStep, userCode]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0 && currentStep) {
      setMessages([{
        role: 'assistant',
        content: `Hi! I'm Axie, your AI tutor. I can see you're working on "${currentStep.title}". Ask me anything!`
      }]);
    }
  }, [isOpen, currentStep]);

  useEffect(() => {
    if (validationError) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `I found an issue in your code!\n\n${validationError}\n\nFix it and try again!`
      }]);
      setIsOpen(true);
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
        content: `Sorry, I encountered an error: ${error.message}. Please try again.` 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button style={styles.floatingButton} onClick={() => setIsOpen(true)}>
        <div style={{ color: '#fff', fontWeight: 'bold' }}>AI</div>
      </button>
    );
  }

  return (
    <div style={styles.overlay}>
      <div style={styles.panel}>
        <div style={styles.header}>
          <div style={styles.headerTitle}>
            <div>
              <h3 style={styles.title}>Axie</h3>
              <p style={styles.subtitle}>Your AI Tutor</p>
            </div>
          </div>
          <button style={styles.closeButton} onClick={() => setIsOpen(false)}>×</button>
        </div>

        <div style={styles.messages}>
          {messages.map((msg, i) => (
            <div 
              key={i} 
              style={msg.role === 'user' ? styles.userMessage : styles.assistantMessage}
            >
              {msg.content}
            </div>
          ))}
          {isLoading && <div style={styles.typing}>Thinking...</div>}
          <div ref={messagesEndRef} />
        </div>

        <div style={styles.inputContainer}>
          <input
            type="text"
            style={styles.input}
            placeholder="Ask me anything..."
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
  floatingButton: {
    position: 'fixed',
    bottom: '2rem',
    right: '2rem',
    width: '70px',
    height: '70px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #00d4aa, #7c3aed)',
    border: '3px solid rgba(255, 255, 255, 0.2)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 8px 24px rgba(0, 212, 170, 0.3)',
    zIndex: 999,
  },
  overlay: {
    position: 'fixed',
    top: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    maxWidth: '450px',
    background: 'rgba(10, 10, 10, 0.98)',
    backdropFilter: 'blur(10px)',
    borderLeft: '1px solid rgba(0, 212, 170, 0.3)',
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
  title: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: '#00d4aa',
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
    fontSize: '2rem',
    cursor: 'pointer',
    padding: '0.5rem',
    lineHeight: 1,
  },
  messages: {
    flex: 1,
    overflowY: 'auto',
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  userMessage: {
    alignSelf: 'flex-end',
    maxWidth: '80%',
    padding: '0.75rem 1rem',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #00d4aa, #7c3aed)',
    color: '#fff',
  },
  assistantMessage: {
    alignSelf: 'flex-start',
    maxWidth: '85%',
    padding: '0.75rem 1rem',
    borderRadius: '12px',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    color: '#fff',
  },
  typing: {
    color: '#888',
    fontStyle: 'italic',
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
    background: 'linear-gradient(135deg, #00d4aa, #7c3aed)',
    border: 'none',
    color: '#fff',
    padding: '0.75rem 1.5rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '0.95rem',
    fontFamily: 'DM Sans',
  },
};

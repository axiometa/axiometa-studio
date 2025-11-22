// Railway internal networking: frontend can call backend directly
const API_URL = import.meta.env.VITE_API_URL || 
                (typeof window !== 'undefined' 
                  ? window.location.origin.replace('frontend', 'backend')
                  : 'http://localhost:8000');

export const api = {
  async validateCode(code, expectedCode = '', instruction = '') {
    console.log(`Validating code with API at: ${API_URL}`);
    
    const response = await fetch(`${API_URL}/api/validate-code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        code, 
        expected_code: expectedCode,
        instruction 
      })
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
      throw new Error(error.detail || 'Validation failed');
    }

    const result = await response.json();
    console.log('Validation result:', result);
    return result;
  },

  async compile(code) {
    console.log(`Compiling code with API at: ${API_URL}`);
    
    const response = await fetch(`${API_URL}/api/compile`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code })
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
      throw new Error(error.detail || 'Compilation failed');
    }

    const result = await response.json();
    console.log('Compile result:', result);
    return result;
  },

  async health() {
    try {
      const response = await fetch(`${API_URL}/health`);
      return await response.json();
    } catch (error) {
      console.error('Health check failed:', error);
      return { status: 'error', error: error.message };
    }
  }
};
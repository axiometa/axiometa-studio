const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const api = {
  async compile(code) {
    const response = await fetch(`${API_URL}/api/compile`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Compilation failed');
    }

    return await response.json(); // Returns { success, binaries, message }
  }
};

export class ConnectionService {
  constructor() {
    this.port = null;
    this.reader = null;
    this.writer = null;
    this.isConnected = false;
    this.isReading = false;
    this.readableStreamClosed = null;
    this.dataCallbacks = [];
    this.disconnectCallbacks = [];
    this.reconnectCallbacks = [];
    this.lastPortInfo = null; // Store port info to detect same device
    
    // Listen for USB disconnect events at the browser level
    this.setupDisconnectListener();
  }

  setupDisconnectListener() {
    if (typeof navigator === 'undefined' || !('serial' in navigator)) return;
    
    // Listen for device disconnection
    navigator.serial.addEventListener('disconnect', (event) => {
      console.log('🔌 Device disconnected event received');
      
      // Check if it's our connected port
      if (this.port && event.target === this.port) {
        console.log('⚠️ Our connected device was disconnected!');
        this.handleUnexpectedDisconnect('Device was disconnected or reset');
      }
    });

    // Listen for device connection (for potential auto-reconnect)
    navigator.serial.addEventListener('connect', (event) => {
      console.log('🔌 Device connected event received');
      
      // If we were connected before and lost connection, this might be a reconnect
      if (!this.isConnected && this.lastPortInfo) {
        console.log('🔄 Device reconnected - may be able to auto-reconnect');
        this.notifyReconnectCallbacks();
      }
    });
  }

  handleUnexpectedDisconnect(reason) {
    const wasConnected = this.isConnected;
    
    // Clean up state
    this.isConnected = false;
    this.isReading = false;
    
    if (this.reader) {
      try { this.reader.releaseLock(); } catch (e) {}
      this.reader = null;
    }
    
    if (this.writer) {
      try { this.writer.releaseLock(); } catch (e) {}
      this.writer = null;
    }
    
    this.readableStreamClosed = null;
    // Keep lastPortInfo for reconnect detection
    // Keep port reference for potential reconnect
    
    if (wasConnected) {
      console.log(`🔴 Unexpected disconnect: ${reason}`);
      this.notifyDisconnectCallbacks(reason);
    }
  }

  async connect() {
    if (!('serial' in navigator)) {
      throw new Error('Web Serial API not supported. Use Chrome or Edge.');
    }

    try {
      this.port = await navigator.serial.requestPort();
      await this.port.open({ baudRate: 9600 });
      this.isConnected = true;
      
      // Store port info for later comparison
      const info = this.port.getInfo();
      this.lastPortInfo = {
        usbVendorId: info.usbVendorId,
        usbProductId: info.usbProductId
      };
      console.log('📍 Connected to device:', this.lastPortInfo);
      
      this.startReading();
      return true;
    } catch (error) {
      throw new Error(`Connection failed: ${error.message}`);
    }
  }

  // Register callback for disconnect events
  onDisconnect(callback) {
    this.disconnectCallbacks.push(callback);
    return () => {
      this.disconnectCallbacks = this.disconnectCallbacks.filter(cb => cb !== callback);
    };
  }

  // Register callback for reconnect opportunities
  onReconnectAvailable(callback) {
    this.reconnectCallbacks.push(callback);
    return () => {
      this.reconnectCallbacks = this.reconnectCallbacks.filter(cb => cb !== callback);
    };
  }

  notifyDisconnectCallbacks(reason) {
    this.disconnectCallbacks.forEach(callback => {
      try {
        callback(reason);
      } catch (error) {
        console.error('Disconnect callback error:', error);
      }
    });
  }

  notifyReconnectCallbacks() {
    this.reconnectCallbacks.forEach(callback => {
      try {
        callback();
      } catch (error) {
        console.error('Reconnect callback error:', error);
      }
    });
  }

  // Check if the port is actually still usable (call before upload)
  async verifyConnection() {
    if (!this.port) {
      console.log('⚠️ No port reference');
      return false;
    }

    try {
      // Try to get port info - this will fail if disconnected
      const info = this.port.getInfo();
      
      // Check if readable/writable streams exist and port is open
      if (!this.port.readable && !this.port.writable) {
        console.log('⚠️ Port streams not available - device may be disconnected');
        this.handleUnexpectedDisconnect('Port streams unavailable');
        return false;
      }
      
      return this.isConnected;
    } catch (error) {
      console.log('⚠️ Port verification failed:', error.message);
      this.handleUnexpectedDisconnect('Port verification failed');
      return false;
    }
  }

  async disconnect() {
    try {
      this.isReading = false;

      if (this.reader) {
        try {
          await this.reader.cancel();
        } catch (e) {
          console.log('Reader cancel error (expected):', e.message);
        }
        
        try {
          this.reader.releaseLock();
        } catch (e) {
          console.log('Reader release error:', e.message);
        }
        
        this.reader = null;
      }

      if (this.readableStreamClosed) {
        try {
          await this.readableStreamClosed.catch(() => {});
        } catch (e) {
          console.log('Pipe close error (expected):', e.message);
        }
        this.readableStreamClosed = null;
      }

      if (this.writer) {
        try {
          this.writer.releaseLock();
        } catch (e) {
          console.log('Writer release error:', e.message);
        }
        this.writer = null;
      }

      await new Promise(resolve => setTimeout(resolve, 100));

      if (this.port) {
        try {
          await this.port.close();
        } catch (e) {
          console.log('Port close error:', e.message);
        }
      }

      this.isConnected = false;
      return true;
    } catch (error) {
      console.error('Disconnect error:', error);
      this.isConnected = false;
      this.port = null;
      return false;
    }
  }

  async startReading() {
    if (!this.port || this.isReading) return;
    
    this.isReading = true;

    try {
      const textDecoder = new TextDecoderStream();
      this.readableStreamClosed = this.port.readable.pipeTo(textDecoder.writable);
      this.reader = textDecoder.readable.getReader();

      let buffer = '';

      while (this.isReading && this.port) {
        try {
          const { value, done } = await this.reader.read();
          
          if (done) {
            console.log('📖 Reader done signal received');
            break;
          }

          buffer += value;
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed) {
              this.notifyDataCallbacks(trimmed);
            }
          }
        } catch (error) {
          if (this.isReading) {
            console.error('Read error:', error);
            // This often happens when device is disconnected
            if (error.message.includes('device has been lost') || 
                error.message.includes('disconnected') ||
                error.message.includes('closed')) {
              this.handleUnexpectedDisconnect('Device lost during read');
            }
            break;
          }
        }
      }
    } catch (error) {
      console.error('Serial reading error:', error);
      // Check if this is a disconnect scenario
      if (error.message.includes('device has been lost') || 
          error.message.includes('disconnected')) {
        this.handleUnexpectedDisconnect('Device lost');
      }
    } finally {
      this.isReading = false;
    }
  }

  onData(callback) {
    this.dataCallbacks.push(callback);
    return () => {
      this.dataCallbacks = this.dataCallbacks.filter(cb => cb !== callback);
    };
  }

  notifyDataCallbacks(line) {
    this.dataCallbacks.forEach(callback => {
      try {
        callback(line);
      } catch (error) {
        console.error('Callback error:', error);
      }
    });
  }

  async write(data) {
    if (!this.isConnected || !this.port) {
      throw new Error('ESP32 not connected');
    }

    try {
      if (!this.writer) {
        this.writer = this.port.writable.getWriter();
      }

      const encoder = new TextEncoder();
      await this.writer.write(encoder.encode(data));

      return true;
    } catch (error) {
      console.error('Write error:', error);
      throw error;
    }
  }

  getConnectionStatus() {
    return this.isConnected;
  }

  getPort() {
    return this.port;
  }

  // Get stored port info for comparison
  getLastPortInfo() {
    return this.lastPortInfo;
  }

  // Clear the port reference (for full reset)
  clearPort() {
    this.port = null;
    this.lastPortInfo = null;
    this.isConnected = false;
  }
}

export const connectionService = new ConnectionService();
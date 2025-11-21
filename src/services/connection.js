export class ConnectionService {
  constructor() {
    this.port = null;
    this.reader = null;
    this.writer = null;
    this.isConnected = false;
    this.isReading = false;
    this.readableStreamClosed = null;
    this.dataCallbacks = [];
  }

  async connect() {
    if (!('serial' in navigator)) {
      throw new Error('Web Serial API not supported. Use Chrome or Edge.');
    }

    try {
      this.port = await navigator.serial.requestPort();
      await this.port.open({ baudRate: 9600 });
      this.isConnected = true;
      
      this.startReading();
      return true;
    } catch (error) {
      throw new Error(`Connection failed: ${error.message}`);
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
          
          if (done) break;

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
            break;
          }
        }
      }
    } catch (error) {
      console.error('Serial reading error:', error);
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
}

export const connectionService = new ConnectionService();
